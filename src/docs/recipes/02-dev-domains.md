# Usando domínios .dev

Todos nós adoramos usar domínios `.dev` bonitos ao desenvolver nossos aplicativos em desenvolvimento. Nesta receita, aprendemos como vincular domínios personalizados ao seu aplicativo em vez de acessá-los via `localhost`.

::: warning OBSERVAÇÃO
Esta técnica não tem nenhuma vantagem ou desvantagem, em vez disso, é usada como uma preferência pessoal em relação a domínios bonitos.
:::

## Configurar hotel
O primeiro passo é configurar uma ferramenta externa chamada [hotel](https://www.npmjs.com/package/hotel). Ela permite que você registre domínios para um aplicativo ou uma URL.

```bash
npm install -g hotel
```

Em seguida, precisamos iniciá-lo como um daemon em `port=2000` usando o seguinte comando.

```bash
hotel start
```

Depois que estiver em execução, você pode executar o comando `hotel ls` para ver a lista de aplicativos/domínios registrados. Que está vazio com a nova instalação.

## Configurar proxy
Vamos entender como isso funciona na teoria. Precisamos dizer ao nosso *navegador* ou *rede do sistema* para passar por um proxy, que atende nossos aplicativos `.dev` ou passa a solicitação para a URL real.

Todo o processo de proxy é muito leve e não afeta o desempenho ou a velocidade do seu sistema.

Agora que sabemos que toda a mágica é feita pelo proxy, vamos atualizar as configurações do navegador/sistema para passar pelo [hotel proxy](https://github.com/typicode/hotel/blob/master/docs/README.md#browser-configuration).

### Configuração do sistema
Precisamos apontar a rede para o arquivo [http://localhost:2000/proxy.pac](http://localhost:2000/proxy.pac).

#### Osx
```
Network Preferences > Advanced > Proxies > Automatic Proxy Configuration
```

#### Windows
```
Settings > Network and Internet > Proxy > Use setup script
```

#### Linux (ubuntu)
```
System Settings > Network > Network Proxy > Automatic
```

### Configuração do navegador
A configuração do navegador apenas faz proxy da solicitação para esse navegador e não para todo o sistema.

#### Chrome (saia do Chrome primeiro)

```bash
# Linux
google-chrome --proxy-pac-url=http://localhost:2000/proxy.pac

# OS X
open -a "Google Chrome" --args --proxy-pac-url=http://localhost:2000/proxy.pac
```

#### Firefox
```bash
Preferences > Advanced > Network > Connection > Settings > Automatic proxy URL configuration
```

## Integrar com AdonisJs
Agora que o hotel está configurado, podemos usá-lo independentemente do AdonisJs para qualquer aplicativo. No entanto, o problema é que todos os aplicativos registrados com `hotel` são mapeados para sempre, a menos que você os remova manualmente.

Esse comportamento pode causar problemas, onde você deseja seus *domínios descartáveis* que vivem até que seu aplicativo esteja em execução.

O comando Adonis cli `adonis serve` aceita um sinalizador que registra um domínio descartável com o *hotel* e o remove quando você para seu aplicativo.

```bash
adonis serve --domain=yardstick@http://localhost:3333
```

O sinalizador `--domain` pega o *domínio* e o *URL*. Neste caso

- `domain=yardstick`
- `url=http://localhost:3333`

