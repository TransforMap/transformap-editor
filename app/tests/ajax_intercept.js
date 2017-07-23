var interceptor = MockingBird.interceptAjax(window);

interceptor.mock("GET", "/posts/123").returns(200, "OK", { "content-type": "text/plain" });