import shutil, os, sys
import imageio
import moviepy
import moviepy.editor as mp
import subprocess

def procesar_video(name, id, filtro):
    VIDEO_FPS = 20
    VIDEO_CODEC = 'libx264'
    FOLDER_FINAL = './uploads/'
    LOGO = "./recursos/logo.jpg"
    AUDIO = "./recursos/audio.mp3"
    EFECT = "./recursos/"+filtro

    vid_title = id
    #video = mp.VideoFileClip("./video1.mov").set_start(0).audio_fadein(1).audio_fadeout(1).fadein(1).fadeout(1)
    video = mp.VideoFileClip(FOLDER_FINAL+name).set_start(0).audio_fadein(0).audio_fadeout(0).fadein(0).fadeout(0)
    TIME = video.duration if video.duration <= 15 else 15
    W,H = video.size

    logo = (mp.ImageClip(LOGO)
                .set_duration(TIME)
                .resize(height=65) # if you need to resize...
                .margin(left=10, top=10, opacity=0)
                .set_pos(("left","top")))

    audio = mp.AudioFileClip(AUDIO).audio_fadein(0).audio_fadeout(0)
    video = video.set_audio(audio.set_duration(TIME))
    final = mp.CompositeVideoClip([video,logo])
    final.subclip(0,TIME).write_videofile('./procesar/'+vid_title+"ready.mp4",fps=VIDEO_FPS, codec=VIDEO_CODEC, verbose=False, progress_bar=True)

    cmd = [
        "ffmpeg",
        "-i",
        "./procesar/"+vid_title+"ready.mp4",
        "-i",
        EFECT,
        "-filter_complex",
        "[0:v] scale={w}:{h}[a]; [1:v] scale={w}:{h}[b]; [a][b] blend=all_mode='overlay':all_opacity=0.7".format(w=W,h=H),
        "-t",
        "0:{time}".format(time=TIME),
        "{title}.mp4".format(title='./procesar/'+vid_title),
        "-y"
    ]

    cmd2 = [
        "ffmpeg",
        "-i",
        './procesar/'+vid_title+".mp4",
        "-ss",
        "00:00:01",
        "-vframes",
         "1",
        "{title}.jpg".format(title='./procesar/'+vid_title)        
    ]

    #subprocess.run(cmd)
    subprocess.call(cmd)
    subprocess.call(cmd2)
    shutil.move('./procesar/'+vid_title+".mp4", FOLDER_FINAL)
    shutil.move('./procesar/'+vid_title+".jpg", FOLDER_FINAL)
    os.remove('./procesar/'+vid_title+"ready.mp4")
    os.remove(FOLDER_FINAL+name)