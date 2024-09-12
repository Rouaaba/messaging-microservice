package main

import (
	"log"
	"testing"

	"github.com/pact-foundation/pact-go/dsl"
)

func TestProvider(t *testing.T) {
	pact := &dsl.Pact{
		Provider: "ProductCatalog",
	}
	defer pact.Teardown()

	// Start provider API in the background
	go startProvider()

	pact.
		AddInteraction().
		Given("Product exists").
		UponReceiving("A request to get product").
		WithRequest(dsl.Request{
			Method:  "GET",
			Path:    dsl.String("/product"),
			Headers: dsl.MapMatcher{"Content-Type": dsl.String("application/json")},
		}).
		WillRespondWith(dsl.Response{
			Status:  200,
			Headers: dsl.MapMatcher{"Content-Type": dsl.String("application/json")},
			Body:    dsl.Match(product{}),
		})

	if err := pact.Verify(); err != nil {
		log.Fatalf("Error on Verify: %v", err)
	}
}
