import { Registry } from '../registry';
import * as routers from './main';
export var Router;
(function (Router) {
    Router.presets = routers;
    Router.registry = Registry.create({
        type: 'router',
    });
    Router.registry.register(Router.presets, true);
})(Router || (Router = {}));
//# sourceMappingURL=index.js.map