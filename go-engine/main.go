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
	redis_url := utils.LoadEnv("REDIS_URL")

	url, err := redis.ParseURL(redis_url)
	if err != nil {
		log.Fatal("parse error")
	}

	client = redis.NewClient(url)
	if client == nil {
		log.Fatal("no client")
	}

}
func processRequest(payload map[string]interface{}) {

}
func executeProcess() {
	ctx := context.Background()
	requestQueue := "request1"

	if client == nil {
		log.Fatal("No clinet")
	}

	for {
		result, err := client.BRPop(ctx, 0, requestQueue).Result()
		fmt.Println("pasting the result", result)

		if err != nil {
			log.Fatal("error while popping")
		}

		var requestData map[string]interface{}
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
	executeProcess()

}
