import sqlite3 as lite
import sys

class database:
	def __init__(self, dbfile):
		self.dbfile = dbfile

	def create_connection(self):
		con = lite.connect(self.dbfile)
		cur = con.cursor()
		cur.execute("CREATE TABLE IF NOT EXISTS video(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, view INTEGER);")
		con.commit()
		return con

	def list_videos(self,n):
		conn = self.create_connection()
		cur = conn.cursor()
		cur.execute("SELECT * FROM video WHERE id > {} LIMIT 12;".format(n))
		return cur.fetchall()
		conn.close()

	"""
		video = {
			'name':'name',
			'view':0
		}
	"""
	def save_video(self, video):
		conn = self.create_connection()
		cur = conn.cursor()
		cur.execute("INSERT INTO video(name, view) VALUES ('{}',{});".format(video['name'],video['view']))
		conn.commit()
		conn.close()

	def view(self, name):
		conn = self.create_connection()
		cur = conn.cursor()
		cur.execute("SELECT view FROM video WHERE name='{}';".format(name))
		value = cur.fetchall()[0][0] + 1
		cur.execute("UPDATE video set view={} WHERE name='{}'".format(value,name))
		conn.commit()
		conn.close()

