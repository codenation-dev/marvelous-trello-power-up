const getIdBadge = function (t) {
    return t
        .card('idShort')
        .get('idShort')
        .then(function (result) {
            return [{
                title: 'Card Number',
                text: '#' + result
            }];
        })
};

const showAuthorizationIframe = function (t) {
    return t.popup({
        title: 'Autorize para usar este recurso',
        url: './authorize.html'
    });
};

const showSearchCardButton = function(t) {
    Trello.setKey(appKey);
    return t.getRestApi().getToken().then(function (token) {
        Trello.setToken(token);
        return t.popup({
            title: 'Card #',
            items: function (t, options) {
                return Trello.get("boards/" + t.getContext().board + "/cards",
                    {
                        query: options.search,
                        fields: 'idShort'
                    }).then(function (result) {
                        if (options.search.length === 0) {
                            return [];
                        }
                        return result.filter(function (i) {
                            return i.idShort === options.search
                        }).map(function (i) {
                            return {
                                text: "#" + i.idShort,
                                callback: function (t) {
                                    return t.showCard(i.id)
                                }
                            }
                        })
                    },
                    function () {
                        t.alert({
                            message: 'Erro ao recuperar cards do board!',
                            duration: 6,
                            display: 'error'
                        });
                    }
                )
            },
            search: {
                placeholder: '#...',
                empty: 'Card não encontrado!',
                searching: 'Buscando...'
            }
        });
    });
};

TrelloPowerUp.initialize({
        'board-buttons': function (t) {
            return t
                .getRestApi()
                .isAuthorized()
                .then(function (isAuthorized) {
                    if (isAuthorized) {
                        return [{
                            text: 'Abrir Card #',
                            callback: showSearchCardButton
                        }]
                    } else {
                        return [{
                            text: 'Abrir Card #',
                            callback: showAuthorizationIframe
                        }]
                    }
                });
        },
        'card-badges': function (t) {
            return getIdBadge(t);
        },
        'card-detail-badges': function (t) {
            return getIdBadge(t);
        }
    },
    {
        appKey: appKey,
        appName: appName,
    }
);
