# Proxy Nginx

Esta receita compartilha as etapas mínimas necessárias para servir o aplicativo AdonisJs usando o proxy `nginx`.

## Primeiros passos
Antes de começar, certifique-se de que você pode executar seu aplicativo na porta definida. Além disso, é recomendável usar um gerenciador de processos como `pm2` para iniciar seu servidor Node.js.

```bash
pm2 start server.js
```

Verifique se está funcionando

```js
pm2 list
```

Para verificar os logs do aplicativo, você pode executar o seguinte comando

```js
pm2 logs
```

## Proxy Nginx

Abra o arquivo de configuração do servidor `default`.

```bash
# empty the file
echo > /etc/nginx/sites-available/default

# open in editor
vi /etc/nginx/sites-available/default
```

Além disso, cole o seguinte código dentro dele.

```bash
server {
  listen 80;

  server_name myapp.com;

  location / {
      proxy_pass http://localhost:3333;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_cache_bypass $http_upgrade;
  }
}
```

### Pontos a serem observados

1. Presume-se que `nginx` esteja instalado e funcionando conforme o esperado.
2. Seu aplicativo está sendo executado na `PORTA 3333`. Caso contrário, altere o bloco `proxy_pass` dentro do arquivo nginx e defina a porta apropriada.
3. Substitua `myapp.com` pelo domínio real do seu aplicativo.
4. Altere o valor de `trustProxy` para *true* dentro do arquivo [config/app.js](https://github.com/adonisjs/adonis-slim-app/blob/develop/config/app.js#L43).

Agora, visitar `myapp.com` mostra seu aplicativo Adonisjs, já que `nginx` está fazendo proxy de todas as solicitações para o aplicativo em execução em uma porta especificada.
