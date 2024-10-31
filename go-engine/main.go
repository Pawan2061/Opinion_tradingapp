package main

import (
	"fmt"
	"log"
	"opinion_trading_app/utils"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func initRedis() {
	fmt.Println("reacheing here")
	redis_url := utils.LoadEnv("REDIS_URL")
	fmt.Println("reached here")

	fmt.Println(redis_url)
	url, err := redis.ParseURL(redis_url)
	if err != nil {
		log.Fatal("parse error")
	}

	client := redis.NewClient(url)
	fmt.Print(client)
}

func main() {

	initRedis()

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	fmt.Println(("this is the start"))

	r.Run(":9000")

}
