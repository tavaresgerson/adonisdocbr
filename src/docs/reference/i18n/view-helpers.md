# Auxiliares para visualizações

A seguir está a lista de propriedades e métodos auxiliares compartilhados com os modelos.

### `i18n`
Uma instância de `i18n` para o local padrão é compartilhada com os modelos como uma propriedade global.

No entanto, o middleware [DetectUserLocale](https://github.com/adonisjs/i18n/blob/develop/templates/DetectUserLocale.txt#L47) substitui essa propriedade e compartilha uma instância específica de solicitação para o local do usuário atual.

```edge
{{ i18n.locale }}
{{ i18n.formatNumber(100) }}
```

### `t`
O auxiliar `t` é um alias para o método `i18n.formatMessage`.

```edge
{{ t('messages.title') }}
```

### `getDefaultLocale`
Retorna o local padrão para o aplicativo.

```edge
{{ getDefaultLocale() }}
```

### `getSupportedLocales`
Retorna uma matriz dos locais suportados.

```edge
{{ getSupportedLocales() }}
```
