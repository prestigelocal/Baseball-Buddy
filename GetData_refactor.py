import mechanize
import cookielib
from bs4 import BeautifulSoup
import csv
import getpass
import datetime
import sys

def main():

	(selection1, selection2, selection3, leagueID, maxPages, username, password) = selection_menu()
	url = buildURL(selection1, selection2, selection3, leagueID)


	filename = 'FBB_data_' + str(leagueID) + '_' + "b" + '_' + str(datetime.date.today()) + '.csv'
	ofile = open(filename, "wb")
	writer = csv.writer(ofile, delimiter = ',', escapechar = ' ')

	# Authentication and Cookie Handling
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
	statsList = soup.findAll('th', {'class':'Ta-end'})
	stats = ['Name', 'Team', 'Pos', 'Fantasy Team']
	for s in statsList:
		t = str(s.findAll(text=True))
		t = t[3:len(t)-2]
		stats.append(t.split(",")[0])
		try:
			stats.remove("Rankings")
		except:
			continue

	writer.writerow(stats)
	pageNum = 0

	while True:
		count = 0
		pageCount = str(pageNum * 25)
		print "Loading page",(pageNum+1)
		content = br.open(url + pageCount)
		soup = BeautifulSoup(content)
		players = soup.findAll('div', {'class':'ysf-player-name Nowrap Grid-u Relative Lh-xs Ta-start'})
		dataList = soup.findAll('td', {'class': 'Ta-end'})
		fantasyTeams = soup.findAll('div', {'style':'text-overflow: ellipsis; overflow: hidden;'})

		fanTeams = []
		for f in fantasyTeams:
			tmpf = str(f.findAll(text=True))[3:len(f)-3]
			fanTeams.append(fixText(tmpf))

		# Exit condition
		try:
			str(players[0].findAll(text=True))
		except:
			break

		for player in players:
			playerStats = []
			pNum = count*(len(stats)-4)
			playerData = str(player.findAll(text=True))
			name = getName(playerData)
			(team, pos) = getTeamAndPosition(playerData)
			fanTeam = fanTeams[count+1]
			playerStats.extend([name, team, pos, fanTeam])
			for i in range(0, len(stats)-4):
				tmp = str(dataList[pNum+i].findAll(text=True))
				tmp = tmp[3:len(tmp)-2]
				if tmp.find("/") != -1:
					playerStats.append("'" + tmp + "'")
				else:
					playerStats.append(tmp)
			print playerStats
			writer.writerow(playerStats)
			count += 1
		pageNum += 1
		if pageNum >= 3: break    
	ofile.close()

def selection_menu():
	# Selection Menu
	leagueID = "91874"
	selection1 = "1"
	selection2 = "6"
	selection3 = "1"
	maxPages = "1"
	username = "matthoffmore"
	password = "N0C0untry"
	return (selection1, selection2, selection3, leagueID, maxPages, username, password)

def buildURL(type, time, available, leagueID):

	begin_url = 'http://baseball.fantasysports.yahoo.com/b1/' + str(leagueID) + '/players?status='

	status = 'ALL'
	pos = 'B'
	timeFrame = 'L'

	if pos == 'P':
		end_url = status + '&pos=' + pos + '&cut_type=33&stat1=S_' + timeFrame + '&myteam=0&sort=50&sdir=1&count='

	if pos == 'B':
		end_url = status + '&pos=' + pos + '&cut_type=33&stat1=S_' + timeFrame + '&myteam=0&sort=60&sdir=1&count='

	print end_url
	return begin_url + end_url

def getName(data):
	if data[2] == '"':
		playerDataName = data.split('"')
	else:
		playerDataName = data.split("'")
	return fixText(playerDataName[1])

def getTeamAndPosition(data):
	playerData = data.split("'")
	if data[2] == '"':
		teampos = playerData[4]
	else:
		teampos = playerData[5]
	team = teampos[0:teampos.find("-")-1]
	pos = teampos[teampos.find("-")+2:len(teampos)]
	return (team, pos)

def fixText(str):
	s = str
	s = s.replace('\\xe1', 'a')
	s = s.replace('\\xe0', 'a')
	s = s.replace('\\xc1', 'A')
	s = s.replace('\\xe9', 'e')
	s = s.replace('\\xc9', 'E')
	s = s.replace('\\xed', 'i')
	s = s.replace('\\xcd', 'I')
	s = s.replace('\\xf3', 'o')
	s = s.replace('\\xd3', 'O')
	s = s.replace('\\xfa', 'u')
	s = s.replace('\\xda', 'U')
	s = s.replace('\\xf1', 'n')
	return s

if __name__ == "__main__":
	main()
