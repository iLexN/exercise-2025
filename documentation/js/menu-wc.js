'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">n1 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' : 'data-bs-target="#xs-controllers-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' :
                                            'id="xs-controllers-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' : 'data-bs-target="#xs-injectables-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' :
                                        'id="xs-injectables-links-module-AppModule-4cf8f4f07e1a9a676a5227c82a7979f6f86d1888587392829064e9798c62b8cccd275e92b8bdd2c0a5f586339472e7e3c310de7294f5994e7fe90a4164c2c7ba"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-1c3c57c71f1fb9518fa6bc7f68e8aa61b20bb9883cd0ebe5c8628f9920b951d05f43b4c7856d150b3f176f317b4abd66a0b769c8aeb038f178d09141be0ba154"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-1c3c57c71f1fb9518fa6bc7f68e8aa61b20bb9883cd0ebe5c8628f9920b951d05f43b4c7856d150b3f176f317b4abd66a0b769c8aeb038f178d09141be0ba154"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-1c3c57c71f1fb9518fa6bc7f68e8aa61b20bb9883cd0ebe5c8628f9920b951d05f43b4c7856d150b3f176f317b4abd66a0b769c8aeb038f178d09141be0ba154"' :
                                        'id="xs-injectables-links-module-AuthModule-1c3c57c71f1fb9518fa6bc7f68e8aa61b20bb9883cd0ebe5c8628f9920b951d05f43b4c7856d150b3f176f317b4abd66a0b769c8aeb038f178d09141be0ba154"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MiddlewaresModule.html" data-type="entity-link" >MiddlewaresModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionsModule.html" data-type="entity-link" >TransactionsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TransactionsModule-a84080975d55ce3e5b29ded35ff377df4ef25b7af3753675915d60c36dd5d3dd84d37f8874b12e3e6e4852489b409970db7897e57fb1f421e8d9513b7bd76896"' : 'data-bs-target="#xs-injectables-links-module-TransactionsModule-a84080975d55ce3e5b29ded35ff377df4ef25b7af3753675915d60c36dd5d3dd84d37f8874b12e3e6e4852489b409970db7897e57fb1f421e8d9513b7bd76896"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransactionsModule-a84080975d55ce3e5b29ded35ff377df4ef25b7af3753675915d60c36dd5d3dd84d37f8874b12e3e6e4852489b409970db7897e57fb1f421e8d9513b7bd76896"' :
                                        'id="xs-injectables-links-module-TransactionsModule-a84080975d55ce3e5b29ded35ff377df4ef25b7af3753675915d60c36dd5d3dd84d37f8874b12e3e6e4852489b409970db7897e57fb1f421e8d9513b7bd76896"' }>
                                        <li class="link">
                                            <a href="injectables/PayVertupayListener.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayVertupayListener</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TransactionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' :
                                            'id="xs-controllers-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' :
                                        'id="xs-injectables-links-module-UsersModule-7dea461576541cd30d5264ea5e90f232a7402f565b3eca42df58469fb9701a5a1a38a156f2be77bdcc4efd211dccca57072d641f211c92086041cde08f8b13de"' }>
                                        <li class="link">
                                            <a href="injectables/UsersConfig.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersConfig</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UtilityModule.html" data-type="entity-link" >UtilityModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/VertupayModule.html" data-type="entity-link" >VertupayModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' : 'data-bs-target="#xs-controllers-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' :
                                            'id="xs-controllers-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' }>
                                            <li class="link">
                                                <a href="controllers/VertupayController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VertupayController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' : 'data-bs-target="#xs-injectables-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' :
                                        'id="xs-injectables-links-module-VertupayModule-4d58e436245858995c2b640cd43f9b830ce002f07e89bfdf2d11c2f5cb7378803f84aad01a0822f12bf5a9ac3f4b8239377f127585c9b8d626edc9c417ed17b7"' }>
                                        <li class="link">
                                            <a href="injectables/VertupayAccountFactory.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VertupayAccountFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VertupayApiClient.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VertupayApiClient</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VertupayService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VertupayService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Transactions.html" data-type="entity-link" >Transactions</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Vertupay.html" data-type="entity-link" >Vertupay</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ApiListRow.html" data-type="entity-link" >ApiListRow</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseCredentials.html" data-type="entity-link" >DatabaseCredentials</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindAllUserDto.html" data-type="entity-link" >FindAllUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionsProcessor.html" data-type="entity-link" >TransactionsProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VertupayAccountBalanceDto.html" data-type="entity-link" >VertupayAccountBalanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VertupayAccountDto.html" data-type="entity-link" >VertupayAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VertupayApiError.html" data-type="entity-link" >VertupayApiError</a>
                            </li>
                            <li class="link">
                                <a href="classes/VertupayPayCreatedEvent.html" data-type="entity-link" >VertupayPayCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/VertupayPayUpdatedEvent.html" data-type="entity-link" >VertupayPayUpdatedEvent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggerMiddleware.html" data-type="entity-link" >LoggerMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggerTimesMiddleware.html" data-type="entity-link" >LoggerTimesMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListContent.html" data-type="entity-link" >ListContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListRow.html" data-type="entity-link" >ListRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VertupayBalanceResponse.html" data-type="entity-link" >VertupayBalanceResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VertupayFundInOut.html" data-type="entity-link" >VertupayFundInOut</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VertupayListResponse.html" data-type="entity-link" >VertupayListResponse</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});