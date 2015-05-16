import mechanize #Todo: deprecate to async requests
import cookielib #Todo: deprecate
from bs4 import BeautifulSoup

from itertools import izip as zip, count

import csv
import getpass
import datetime
import sys

def main():
  #type_input, time_input, leagueID, username, password) = selection_menu()
  #url = buildURL(type_input, time_input, leagueID)
  url = "http://baseball.fantasysports.yahoo.com/b1/91874/3"
  cj = cookielib.CookieJar()
  br = mechanize.Browser()
  br.set_handle_robots(False)
  br.addheaders = [('User-agent', 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.6')]
  br.set_cookiejar(cj)
  br.open("https://login.yahoo.com/config/login_verify2?&.src=ym&.intl=us")
  br.select_form(nr=0)
  br.form["username"] = "matthoffmore"
  br.form["passwd"] = "N0C0untry"
  br.submit()
  content = br.open(url + '0')
  soup = BeautifulSoup(content)
  #stats = ['Name', 'Team', 'Pos', 'Fantasy Team']
  statsList = soup.findAll('th', {'class':'Ta-end'})
  players = soup.findAll('div', {'class':'ysf-player-name Nowrap Grid-u Relative Lh-xs Ta-start'})
  dataList = soup.findAll('td', {'class': 'Ta-end'})

  print statsList
  print players
  #print x.findAll(text=True) for x in dataList

  for player in players:
      CreateStatIndex()
      playerStats = []
      playerData = str(player.findAll(text=True))
      print playerData
      for i in range(0, 19):
          tmp = str(dataList[i].findAll(text=True))
          tmp = tmp[3:len(tmp)-2]
          if tmp.find("/") != -1:
              playerStats.append("'" + tmp + "'")
          else:
              playerStats.append(tmp)
  print playerStats


  def CreateStatIndex():
      l = 3
      h = 8
      lowStat = []
      highStat = []
      while l and h < 273:
          print l, h
          lowStat.append(l)
          highStat.append(h)
          l+=9
          h+=9
      return global lowStat, highStat

  playerList = []
  for player in players:
      playerList.append(player.findAll(href=True)[0].text)

  for player in players:
      chosenPlayer = [i for i, j in zip(count(), playerList) if j == '%s']

if __name__ == "__main__":
    main()
