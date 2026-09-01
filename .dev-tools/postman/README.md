# Postman development collection

Start the application:

```bash
npm run dev
```

Import `meu-carrinho-bff.postman_collection.json` into Postman and run the
collection in its defined order. The collection uses
`http://127.0.0.1:3000` by default and automatically stores the ID returned by
the create request for the following detail request.

To use another server, change the collection-level `baseUrl` variable.
