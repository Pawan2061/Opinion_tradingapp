package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"opinion_trading_app/utils"

	"github.com/redis/go-redis/v9"
)

var client *redis.Client

func initRedis() {
	fmt.Println("reacheing here")
	redis_url := utils.LoadEnv("REDIS_URL")

	fmt.Println("reached	 here")

	fmt.Println(redis_url)
	url, err := redis.ParseURL(redis_url)
	if err != nil {
		log.Fatal("parse error")
	}

	client = redis.NewClient(url)
	if client == nil {
		log.Fatal("no client")
	}
	fmt.Print(client)

}
func processRequest(payload map[string]interface{}) {

}
func executeProcess() {
	fmt.Println("inside executre process")
	ctx := context.Background()
	requestQueue := "request1"

	if client == nil {
		log.Fatal("No clinet")
	}

	for {
		result, err := client.BRPop(ctx, 0, requestQueue).Result()
		fmt.Println("pasting the result", result)

		if err != nil {
			fmt.Print(err.Error())
			log.Fatal("error while popping")
		}

		var requestData map[string]interface{}
		fmt.Println("enfiefoe")
		err = json.Unmarshal([]byte(result[1]), &requestData)
		if err != nil {
			log.Println("Error parsing JSON:", err)
			continue
		}
		fmt.Println(requestData, "request data is here")
		processRequest(requestData)
		if err != nil {
			log.Println("Error parsing JSON:", err)
			continue
		}

	}

}

func main() {

	initRedis()
	fmt.Println("connected to redis")
	executeProcess()

	fmt.Println(("this is the start"))

}
