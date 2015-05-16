import json, time, requests

def main():
	day = time.strftime("%d")
	month = time.strftime("%m")
	content = requests.get("http://gd2.mlb.com/components/game/mlb/year_2015/month_%s/day_%s/master_scoreboard.json"%(month,day)).content
	JS = json.loads(content)
	game_start = JS['data']['games']['game'][0]['time']
	print "The first game starts at " + game_start
	return game_start

if __name__ == '__main__':
	main()
