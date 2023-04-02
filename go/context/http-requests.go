package main

import (
	"fmt"
	"net/http"
	"time"
)

const handlerWaitTime = 10 * time.Second

func fakeAPIHandler(w http.ResponseWriter, req *http.Request) {
	// The http.Request will already have a context attached to it. When the request is for an
	// incoming request (which is the case since we are acting like an API server), the context will
	// be cancelled when the client closes the HTTP connection, the request is cancelled by HTTP/2,
	// or the ServeHTTP method returns. Using this context allows the user to cancel the request by
	// closing the connection. Without it, the user could close the connection and the server will
	// still be using resources trying to fulfil the request.
	ctx := req.Context()
	fmt.Println("API Server: Fake handler started...")
	defer fmt.Println("API Server: Fake handler ended")

	select {
	case <-time.After(handlerWaitTime):
		fmt.Print("Finished waiting ", handlerWaitTime)
	case <-ctx.Done():
		err := ctx.Err()
		fmt.Println("Context Error:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	// This will start the fake API server. You can make a request to localhost:3000/test to start
	// the handler. The handler will wait for handlerWaitTime before exiting normally, but
	// cancelling the request (by hitting ctrl+c) will allow you to simulate a client cancelling
	// the request.
	http.HandleFunc("/test", fakeAPIHandler)
	http.ListenAndServe(":3000", nil)
}
