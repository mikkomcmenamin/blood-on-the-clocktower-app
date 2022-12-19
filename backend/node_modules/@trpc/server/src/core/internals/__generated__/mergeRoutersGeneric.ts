import { AnyRouter, AnyRouterDef, Router } from "../../router";
 import { mergeRouters } from '../mergeRouters';

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef
 >(
   router0: Router<RP0>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'];
  mutations: RP0['mutations'];
  subscriptions: RP0['subscriptions'];
  procedures: RP0['procedures'];
  record: RP0['record'];
  isDev: boolean;
 }> & RP0['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'];
  mutations: RP0['mutations'] & RP1['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'];
  record: RP0['record'] & RP1['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef, RP14 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>, router14: Router<RP14>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'] & RP14['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'] & RP14['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'] & RP14['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'] & RP14['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef, RP14 extends AnyRouterDef, RP15 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>, router14: Router<RP14>, router15: Router<RP15>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'] & RP14['queries'] & RP15['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'] & RP14['mutations'] & RP15['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'] & RP14['subscriptions'] & RP15['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'] & RP14['procedures'] & RP15['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef, RP14 extends AnyRouterDef, RP15 extends AnyRouterDef, RP16 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>, router14: Router<RP14>, router15: Router<RP15>, router16: Router<RP16>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'] & RP14['queries'] & RP15['queries'] & RP16['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'] & RP14['mutations'] & RP15['mutations'] & RP16['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'] & RP14['subscriptions'] & RP15['subscriptions'] & RP16['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'] & RP14['procedures'] & RP15['procedures'] & RP16['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef, RP14 extends AnyRouterDef, RP15 extends AnyRouterDef, RP16 extends AnyRouterDef, RP17 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>, router14: Router<RP14>, router15: Router<RP15>, router16: Router<RP16>, router17: Router<RP17>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'] & RP14['queries'] & RP15['queries'] & RP16['queries'] & RP17['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'] & RP14['mutations'] & RP15['mutations'] & RP16['mutations'] & RP17['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'] & RP14['subscriptions'] & RP15['subscriptions'] & RP16['subscriptions'] & RP17['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'] & RP14['procedures'] & RP15['procedures'] & RP16['procedures'] & RP17['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'] & RP17['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'] & RP17['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef, RP14 extends AnyRouterDef, RP15 extends AnyRouterDef, RP16 extends AnyRouterDef, RP17 extends AnyRouterDef, RP18 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>, router14: Router<RP14>, router15: Router<RP15>, router16: Router<RP16>, router17: Router<RP17>, router18: Router<RP18>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'] & RP14['queries'] & RP15['queries'] & RP16['queries'] & RP17['queries'] & RP18['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'] & RP14['mutations'] & RP15['mutations'] & RP16['mutations'] & RP17['mutations'] & RP18['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'] & RP14['subscriptions'] & RP15['subscriptions'] & RP16['subscriptions'] & RP17['subscriptions'] & RP18['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'] & RP14['procedures'] & RP15['procedures'] & RP16['procedures'] & RP17['procedures'] & RP18['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'] & RP17['record'] & RP18['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'] & RP17['record'] & RP18['record'];

export function mergeRoutersGeneric<
   RP0 extends AnyRouterDef, RP1 extends AnyRouterDef, RP2 extends AnyRouterDef, RP3 extends AnyRouterDef, RP4 extends AnyRouterDef, RP5 extends AnyRouterDef, RP6 extends AnyRouterDef, RP7 extends AnyRouterDef, RP8 extends AnyRouterDef, RP9 extends AnyRouterDef, RP10 extends AnyRouterDef, RP11 extends AnyRouterDef, RP12 extends AnyRouterDef, RP13 extends AnyRouterDef, RP14 extends AnyRouterDef, RP15 extends AnyRouterDef, RP16 extends AnyRouterDef, RP17 extends AnyRouterDef, RP18 extends AnyRouterDef, RP19 extends AnyRouterDef
 >(
   router0: Router<RP0>, router1: Router<RP1>, router2: Router<RP2>, router3: Router<RP3>, router4: Router<RP4>, router5: Router<RP5>, router6: Router<RP6>, router7: Router<RP7>, router8: Router<RP8>, router9: Router<RP9>, router10: Router<RP10>, router11: Router<RP11>, router12: Router<RP12>, router13: Router<RP13>, router14: Router<RP14>, router15: Router<RP15>, router16: Router<RP16>, router17: Router<RP17>, router18: Router<RP18>, router19: Router<RP19>
 ): Router<{
  _config: RP0['_config'];
  router: true;
  queries: RP0['queries'] & RP1['queries'] & RP2['queries'] & RP3['queries'] & RP4['queries'] & RP5['queries'] & RP6['queries'] & RP7['queries'] & RP8['queries'] & RP9['queries'] & RP10['queries'] & RP11['queries'] & RP12['queries'] & RP13['queries'] & RP14['queries'] & RP15['queries'] & RP16['queries'] & RP17['queries'] & RP18['queries'] & RP19['queries'];
  mutations: RP0['mutations'] & RP1['mutations'] & RP2['mutations'] & RP3['mutations'] & RP4['mutations'] & RP5['mutations'] & RP6['mutations'] & RP7['mutations'] & RP8['mutations'] & RP9['mutations'] & RP10['mutations'] & RP11['mutations'] & RP12['mutations'] & RP13['mutations'] & RP14['mutations'] & RP15['mutations'] & RP16['mutations'] & RP17['mutations'] & RP18['mutations'] & RP19['mutations'];
  subscriptions: RP0['subscriptions'] & RP1['subscriptions'] & RP2['subscriptions'] & RP3['subscriptions'] & RP4['subscriptions'] & RP5['subscriptions'] & RP6['subscriptions'] & RP7['subscriptions'] & RP8['subscriptions'] & RP9['subscriptions'] & RP10['subscriptions'] & RP11['subscriptions'] & RP12['subscriptions'] & RP13['subscriptions'] & RP14['subscriptions'] & RP15['subscriptions'] & RP16['subscriptions'] & RP17['subscriptions'] & RP18['subscriptions'] & RP19['subscriptions'];
  procedures: RP0['procedures'] & RP1['procedures'] & RP2['procedures'] & RP3['procedures'] & RP4['procedures'] & RP5['procedures'] & RP6['procedures'] & RP7['procedures'] & RP8['procedures'] & RP9['procedures'] & RP10['procedures'] & RP11['procedures'] & RP12['procedures'] & RP13['procedures'] & RP14['procedures'] & RP15['procedures'] & RP16['procedures'] & RP17['procedures'] & RP18['procedures'] & RP19['procedures'];
  record: RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'] & RP17['record'] & RP18['record'] & RP19['record'];
  isDev: boolean;
 }> & RP0['record'] & RP1['record'] & RP2['record'] & RP3['record'] & RP4['record'] & RP5['record'] & RP6['record'] & RP7['record'] & RP8['record'] & RP9['record'] & RP10['record'] & RP11['record'] & RP12['record'] & RP13['record'] & RP14['record'] & RP15['record'] & RP16['record'] & RP17['record'] & RP18['record'] & RP19['record'];

export function mergeRoutersGeneric(...args: AnyRouter[]): AnyRouter {
   return mergeRouters(...args) as any;
 }