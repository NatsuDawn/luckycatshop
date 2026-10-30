System.register("chunks:///_virtual/adLoading.ts", ['cc', './kit.ts', './skin.ts', './ads.ts', './assets.ts', './i18n.ts', './text.ts'], function (exports) {
  var cclegacy, UI, Image, Text, ink, Cancel$1, IsAvailable, ShowRewarded, resolveAsset, L, textWidth;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Text = module.Text;
      ink = module.ink;
    }, function (module) {
      Cancel$1 = module.Cancel;
      IsAvailable = module.IsAvailable;
      ShowRewarded = module.ShowRewarded;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      L = module.L;
    }, function (module) {
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports({
        Blocked: Blocked,
        Cancel: Cancel,
        Close: Close,
        Request: Request,
        Show: Show,
        Update: Update
      });
      cclegacy._RF.push({}, "f61ccIG3HlMT6RTh09kQAa6", "adLoading", undefined);
      function Blocked(app) {
        return app.adLoading !== undefined;
      }
      function owns(app, state) {
        var _app$g, _state$page, _state$hostRoot;
        return app.root === state.hostRoot && app.page === state.page && app.screen === state.screen && ((_app$g = app.g) == null ? void 0 : _app$g.run) === state.run && !!((_state$page = state.page) != null && _state$page.node.isValid) && !!((_state$hostRoot = state.hostRoot) != null && _state$hostRoot.node.isValid);
      }
      function Close(app) {
        var state = app.adLoading;
        if (!state) return;
        app.adLoading = undefined;
        state.root.Destroy();
      }
      function Cancel(app) {
        var _app$adLoading;
        var state = (_app$adLoading = app.adLoading) != null ? _app$adLoading : app.adLoadingRequest;
        Close(app);
        app.adLoadingRequest = undefined;
        if ((state == null ? void 0 : state.requestId) !== undefined) Cancel$1(state.requestId);
      }
      function Show(app) {
        var _ref, _ref2, _ref3, _app$g2;
        if (app.adLoading) return app.adLoading;
        var p = app.page.props;
        // The root swallows every touch while the ad loads.
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          onClick: function onClick() {}
        });
        var canvas = UI.Panel({
          position: 'absolute',
          left: (_ref = p.left) != null ? _ref : 0,
          top: (_ref2 = p.top) != null ? _ref2 : 0,
          width: 360,
          height: 640,
          scale: (_ref3 = p.scale) != null ? _ref3 : 1,
          transformOrigin: 'top-left',
          pointerEvents: 'none',
          backgroundColor: [47, 32, 20, 105]
        });
        root.AddChild(canvas);
        var asset = resolveAsset('ui.loading.status_paper');
        if (!asset) throw new Error('Missing approved ad loading paper');
        var w = 216,
          h = 96,
          k = w / asset.width;
        var paperTop = app.screen === 'result' ? 144 : 206;
        var paper = UI.Panel({
          position: 'absolute',
          left: 72,
          top: paperTop,
          width: w,
          height: h,
          pointerEvents: 'none'
        });
        var sl = asset.slices;
        paper.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: asset.width,
          height: h / k,
          scale: k,
          transformOrigin: 'top-left',
          backgroundImage: asset.path,
          backgroundFit: 'sliced',
          backgroundSlice: [sl[1], sl[2], sl[3], sl[0]],
          pointerEvents: 'none'
        }));
        // The 38 + 5 + 25 content group is centred vertically in the 96-unit paper.
        var yarn = Image('ui.loading.yarn', 89, 14, 38, 38);
        paper.AddChild(yarn);
        var value = L('广告加载中…').split('…').join('');
        var size = 16,
          tw = textWidth(value, size, 'sans'),
          slot = textWidth('.', size, 'sans');
        var left = (w - tw - slot * 3 - 3) / 2;
        var caption = Text(value, size, left, 57, tw + 1, 25, ink, 'left', 'sans');
        caption.SetStyle({
          minFontSize: size
        });
        paper.AddChild(caption);
        var dots = [0, 1, 2].map(function (i) {
          var d = Text('.', size, left + tw + 3 + i * slot, 57, slot + 1, 25, ink, 'left', 'sans');
          d.SetStyle({
            minFontSize: size,
            opacity: i === 0 ? 1 : 0
          });
          paper.AddChild(d);
          return d;
        });
        canvas.AddChild(paper);
        app.root.AddChild(root);
        var state = {
          hostRoot: app.root,
          page: app.page,
          screen: app.screen,
          run: (_app$g2 = app.g) == null ? void 0 : _app$g2.run,
          time: 0,
          root: root,
          canvas: canvas,
          refs: {
            paper: paper,
            yarn: yarn,
            label: caption,
            dots: dots
          }
        };
        app.adLoading = state;
        if (app.g) {
          app.g.drag = undefined;
          app.g.queued = undefined;
        }
        return state;
      }
      function Request(app, placement, onDone) {
        if (!IsAvailable()) return undefined;
        var state = Show(app);
        app.adLoadingRequest = state;
        var id = ShowRewarded(placement, function (result) {
          // No reward may be applied to an owner destroyed before its callback.
          if (!owns(app, state)) {
            result.success = false;
            result.reason = 'page destroyed';
          }
          if (app.adLoading === state) Close(app);
          if (app.adLoadingRequest === state) app.adLoadingRequest = undefined;
          onDone(result);
        }, function () {
          if (app.adLoading === state) Close(app);
        });
        state.requestId = id;
        if (id === undefined) {
          Close(app);
          app.adLoadingRequest = undefined;
        }
        return id;
      }
      function Update(app, dt) {
        var _ref4, _ref5, _ref6;
        var request = app.adLoadingRequest;
        if (request && !owns(app, request)) {
          Cancel(app);
          return;
        }
        var state = app.adLoading;
        if (!state) return;
        if (!owns(app, state)) {
          Cancel(app);
          return;
        }
        state.time += dt;
        var p = app.page.props;
        state.canvas.SetStyle({
          left: (_ref4 = p.left) != null ? _ref4 : 0,
          top: (_ref5 = p.top) != null ? _ref5 : 0,
          scale: (_ref6 = p.scale) != null ? _ref6 : 1
        });
        state.refs.yarn.SetStyle({
          rotate: state.time * 180 % 360
        });
        var count = Math.floor(state.time / .35) % 3 + 1;
        state.refs.dots.forEach(function (dot, i) {
          return dot.SetStyle({
            opacity: i < count ? 1 : 0
          });
        });
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ads.ts", ['cc', './config.ts', './audio.ts'], function (exports) {
  var cclegacy, ADS_ENABLED, pauseAudio, resumeAudio;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ADS_ENABLED = module.ADS_ENABLED;
    }, function (module) {
      pauseAudio = module.pauseAudio;
      resumeAudio = module.resumeAudio;
    }],
    execute: function () {
      exports({
        Busy: Busy,
        Cancel: Cancel,
        HasSupport: HasSupport,
        Init: Init,
        IsAvailable: IsAvailable,
        ShowRewarded: ShowRewarded,
        Update: Update
      });
      cclegacy._RF.push({}, "84466JJiSFFA6Fvzu4iPWnS", "ads", undefined);
      var TIMEOUT = exports('TIMEOUT', 90); // seconds without a callback before the request ends as failed (never as success)
      var clock = 0;
      var nextId = exports('nextId', 0);
      var current;
      var adapter;
      function Init(a) {
        current = undefined;
        clock = 0;
        adapter = a;
        console.log('[Ads] adapter', adapter ? adapter.name : 'none', 'enabled', String(ADS_ENABLED));
      }
      // Whether an ad entry may be shown now (switch on, platform available, no request in flight).
      function IsAvailable() {
        return adapter !== undefined && current === undefined && adapter.available();
      }
      function HasSupport() {
        return adapter !== undefined && adapter.available();
      }
      function Busy() {
        return current !== undefined;
      }
      function finish(req, success, reason) {
        if (req.done) return; // repeated / late callbacks and timeouts all end here
        req.done = true;
        if (current === req) current = undefined;
        console.log('[Ads] finish', req.id, req.placement, String(success), reason);
        resumeAudio('ads:' + reason);
        try {
          req.onDone({
            success: success,
            reason: reason,
            requestId: req.id,
            placement: req.placement
          });
        } catch (e) {
          console.log('[Ads] onDone error', String(e));
        }
      }
      // Starts one rewarded ad. Returns the request id, or undefined (and no callback) when unavailable or busy.
      function ShowRewarded(placement, onDone, onStarted) {
        if (!IsAvailable()) return undefined;
        exports('nextId', nextId + 1), nextId++;
        var req = {
          id: nextId,
          placement: placement,
          onDone: onDone,
          started: clock,
          done: false
        };
        current = req;
        var accepted = false;
        try {
          accepted = adapter.show(function (success, msg) {
            return finish(req, success === true, success ? 'success' : msg != null ? msg : 'failed');
          }, function () {
            // Request acceptance is not playback start; only an adapter with a real start signal calls this.
            if (req.done || req.playing) return;
            req.playing = true;
            pauseAudio('ads');
            onStarted == null || onStarted();
          });
        } catch (e) {
          finish(req, false, 'error: ' + String(e));
          return req.id;
        }
        if (!accepted) finish(req, false, 'not accepted');
        return req.id;
      }
      // Destroyed owners release the single request lock; any later host callback is ignored.
      function Cancel(requestId) {
        var req = current;
        if (!req || req.id !== requestId) return false;
        finish(req, false, 'page destroyed');
        return true;
      }
      // Watchdog: a request without a callback ends as a failure after TIMEOUT seconds.
      function Update(dt) {
        clock += dt;
        var req = current;
        if (req && !req.done && clock - req.started >= TIMEOUT) finish(req, false, 'timeout');
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/app.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './design.ts', './catView.ts', './profile.ts', './i18n.ts', './handbook.ts', './game.ts', './tips.ts', './adLoading.ts', './audio2.ts', './itemOverlay.ts', './loadError.ts', './resumeCountdown.ts', './text.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, screen, ResolutionPolicy, view, Node, UITransform, Graphics, sys, Color, UI, PageFill, TallBands, TALL_BAND, Update$2, setClock, Profile, L, Open, Close, Update$1, install, Blocked$1, Close$2, Blocked, UpdateContext, Update, CloseDetail, Close$1, Start, fitSize, textWidth;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      screen = module.screen;
      ResolutionPolicy = module.ResolutionPolicy;
      view = module.view;
      Node = module.Node;
      UITransform = module.UITransform;
      Graphics = module.Graphics;
      sys = module.sys;
      Color = module.Color;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      PageFill = module.PageFill;
      TallBands = module.TallBands;
      TALL_BAND = module.TALL_BAND;
    }, function (module) {
      Update$2 = module.Update;
    }, function (module) {
      setClock = module.setClock;
      Profile = module.Profile;
    }, function (module) {
      L = module.L;
    }, function (module) {
      Open = module.Open;
      Close = module.Close;
    }, function (module) {
      Update$1 = module.Update;
      install = module.install;
    }, function (module) {
      Blocked$1 = module.Blocked;
      Close$2 = module.Close;
    }, function (module) {
      Blocked = module.Blocked;
    }, function (module) {
      UpdateContext = module.UpdateContext;
      Update = module.Update;
    }, function (module) {
      CloseDetail = module.CloseDetail;
    }, function (module) {
      Close$1 = module.Close;
    }, function (module) {
      Start = module.Start;
    }, function (module) {
      fitSize = module.fitSize;
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports({
        applyResolution: applyResolution,
        createApp: createApp,
        fixLayers: fixLayers
      });
      cclegacy._RF.push({}, "08e49d6OllDqYHIHVDV4318", "app", undefined);
      // The design canvas always fits whole: fix the side that is relatively shorter, so the visible area is >= 360x640.
      function applyResolution() {
        var size = screen.windowSize;
        var policy = size.height / size.width >= 640 / 360 ? ResolutionPolicy.FIXED_WIDTH : ResolutionPolicy.FIXED_HEIGHT;
        view.setDesignResolutionSize(360, 640, policy);
      }
      // storage: the platform's save store; onGameplay: the portal's gameplay start/stop (playing = the run's board is live).
      function createApp(canvas, pages, storage, onGameplay) {
        if (onGameplay === void 0) {
          onGameplay = function onGameplay() {};
        }
        var playing = false;
        // Device clock until a platform supplies a trusted one (Maker: common.get_server_time()).
        setClock(function () {
          return Math.floor(Date.now() / 1000);
        });
        var app = {
          profile: Profile.Load(storage),
          refs: {},
          screen: 'boot',
          page: null,
          root: null,
          holder: null,
          toastTime: 0,
          clock: 0,
          // A short message in the page's message label (Maker App.Toast; the label is page-specific).
          Toast: function Toast(textIn) {
            var message = app.refs.message;
            var text = L(textIn).split("\u200B").join('');
            app.toastTime = 2.4;
            if (!message) {
              console.log('[Toast]', text);
              return;
            }
            message.StopAnimation();
            message.SetText(text);
            message.SetStyle({
              opacity: 1
            });
            // In play the tip is only as wide as its text (+24), in the right part of the row (x164-352), clear of the
            // time-bonus tag under the timer; longer copy shrinks to 9 pt on one line.
            if (app.screen === 'game' && app.refs.playTipBox) {
              var size = fitSize(text, 11, 'body', 164);
              var w = Math.min(188, textWidth(text, size, 'body') + 24);
              message.SetStyle({
                left: 258 - w / 2,
                width: w,
                fontSize: size
              });
            }
          },
          Home: function Home() {
            return pages.Home(app);
          },
          Cats: function Cats() {
            var _pages$Cats;
            return ((_pages$Cats = pages.Cats) != null ? _pages$Cats : pages.Home)(app);
          },
          Settings: function Settings() {
            var _pages$Settings;
            return ((_pages$Settings = pages.Settings) != null ? _pages$Settings : pages.Home)(app);
          },
          Handbook: function Handbook() {
            Open(app);
          },
          NewGame: function NewGame() {},
          Game: function Game() {},
          Events: function Events() {},
          Pause: function Pause() {},
          EndRun: function EndRun() {},
          Finish: function Finish() {},
          RefreshHUD: function RefreshHUD() {},
          SetCellArt: function SetCellArt() {},
          Result: function Result() {
            var _pages$Result;
            return ((_pages$Result = pages.Result) != null ? _pages$Result : pages.Home)(app);
          },
          Upgrades: function Upgrades() {
            var _pages$Upgrades;
            return ((_pages$Upgrades = pages.Upgrades) != null ? _pages$Upgrades : pages.Home)(app);
          },
          // ESC / Android back: play pauses, pause resumes, overlays close, sub-pages return home; home, result and the
          // upgrade choice ignore it.
          Back: function Back() {
            if (Blocked(app)) return;
            if (app.handbook) {
              Close(app);
              return;
            }
            if (app.refs.loadErrorNotice) {
              Close$1(app);
              return;
            }
            if (Blocked$1(app)) {
              Close$2(app, false);
              return;
            }
            var s = app.screen;
            if (s === 'game') app.Pause();else if (s === 'pause') Start(app);else if (s === 'item_detail') CloseDetail(app);else if (s === 'language') {
              if (!app.languageSwitching) app.Settings();
            } else if (s === 'settings' || s === 'cats' || s === 'rank' || s === 'replace_pet') app.Home();
          },
          ViewSize: function ViewSize() {
            return [360, 640];
          },
          MountPage: function MountPage(page) {
            var _app$root, _TallBands;
            app.page = page;
            var vs = view.getVisibleSize();
            if (!app.holder) {
              app.holder = new Node('UIRoot');
              app.holder.layer = canvas.layer;
              canvas.addChild(app.holder);
            }
            app.holder.setPosition(-vs.width / 2, vs.height / 2, 0);
            (_app$root = app.root) == null || _app$root.Destroy();
            var root = UI.Panel({
              width: vs.width,
              height: vs.height,
              overflow: 'hidden'
            });
            root.node.layer = canvas.layer;
            app.holder.addChild(root.node);
            root.AddChild(PageFill(page.props.fillKey));
            // The scene continued above and below the page on tall screens (placed in FitPage).
            tallBands = (_TallBands = TallBands(page.props.fillKey)) != null ? _TallBands : null;
            if (tallBands) {
              root.AddChild(tallBands[0]);
              root.AddChild(tallBands[1]);
            }
            root.AddChild(page);
            // Washes and dims repeated outside the page (drawOutside). Drawn above the page but only outside its
            // rectangle, so they also cover the anchor groups the tall-screen layout moves past the page edges.
            var outside = new Node('outside');
            outside.layer = canvas.layer;
            outside.addComponent(UITransform).setAnchorPoint(0, 1);
            outsideGraphics = outside.addComponent(Graphics);
            root.node.addChild(outside);
            // While a modal covers the page (pause, item card, handbook, tip, notices), these swallow taps above and
            // below it, where the tall-screen layout has moved buttons out of the modal's reach.
            // A tap there counts as a tap on the modal's backdrop (a tip closes, a card stays).
            outsideBlockers = [0, 1].map(function () {
              return UI.Panel({
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1,
                height: 1,
                visible: false,
                onClick: function onClick() {
                  var m = app.page ? modalOpen(app.page) : null;
                  if (m) m.props.onClick == null || m.props.onClick(m);
                }
              });
            });
            for (var _iterator = _createForOfIteratorHelperLoose(outsideBlockers), _step; !(_step = _iterator()).done;) {
              var b = _step.value;
              root.AddChild(b);
            }
            lastAnchorFit = '';
            setLayerDeep(root.node, canvas.layer);
            app.root = root;
            app.FitPage();
          },
          FitPage: function FitPage() {
            if (!app.page || !app.root) return;
            var vs = view.getVisibleSize();
            // The window can change size after mounting (Android immersive mode, rotation, browser resize): keep the
            // screen root covering the whole visible area.
            if (app.holder && (Math.abs(app.root.props.width - vs.width) > .5 || Math.abs(app.root.props.height - vs.height) > .5)) {
              app.holder.setPosition(-vs.width / 2, vs.height / 2, 0);
              app.root.SetStyle({
                width: vs.width,
                height: vs.height
              });
            }
            // Safe area in design units (notch / home indicator); the page scales down only if it does not fit.
            var safe = sys.getSafeAreaRect();
            var x = safe.x,
              w = safe.width,
              h = safe.height,
              top = vs.height - (safe.y + safe.height);
            var scale = Math.max(0, Math.min(1, w / 360, h / 640));
            var left = x + (w - 360 * scale) / 2,
              y = top + (h - 640 * scale) / 2;
            var key = vs.width + "x" + vs.height + " safe " + safe.x + "," + safe.y + "," + safe.width + "," + safe.height;
            if (key !== lastFitLog) {
              lastFitLog = key;
              console.log('[App] fit visible', key, 'page', left, y, scale);
            }
            app.page.SetStyle({
              position: 'absolute',
              left: left,
              top: y,
              width: 360,
              height: 640,
              scale: scale,
              transformOrigin: 'top-left',
              visible: scale > 0
            });
            if (tallBands) {
              tallBands[0].SetStyle({
                left: left,
                top: y - TALL_BAND * scale,
                scale: scale,
                transformOrigin: 'top-left',
                visible: scale > 0
              });
              tallBands[1].SetStyle({
                left: left,
                top: y + 640 * scale,
                scale: scale,
                transformOrigin: 'top-left',
                visible: scale > 0
              });
            }
            // Tall-screen layout: anchor groups move by the extra safe-area height beside the page (page units, at most
            // TALL_BAND); the page stops clipping while anything sits outside it.
            var extra = scale > 0 ? Math.max(0, Math.min(TALL_BAND, (h / scale - 640) / 2)) : 0;
            // (FitPage runs every frame: restyle only when the shift, the page box or the modal state changes.)
            var block = extra > .5 && (app.adLoading !== undefined || modalOpen(app.page) !== null);
            var fitKey = app.page.node.uuid + " " + extra.toFixed(2) + " " + y.toFixed(2) + " " + scale.toFixed(4) + " " + vs.width + "x" + vs.height + " " + block;
            if (fitKey !== lastAnchorFit) {
              lastAnchorFit = fitKey;
              for (var _iterator2 = _createForOfIteratorHelperLoose(app.page.children), _step2; !(_step2 = _iterator2()).done;) {
                var _c = _step2.value;
                var side = _c.props.anchor;
                if (side === 'top' || side === 'bottom') _c.SetStyle({
                  translateY: side === 'top' ? -extra : extra
                });
              }
              app.page.SetStyle({
                overflow: extra > .5 ? 'visible' : 'hidden'
              });
              if (outsideBlockers) {
                outsideBlockers[0].SetStyle({
                  left: 0,
                  top: 0,
                  width: vs.width,
                  height: Math.max(0, y),
                  visible: block
                });
                outsideBlockers[1].SetStyle({
                  left: 0,
                  top: y + 640 * scale,
                  width: vs.width,
                  height: Math.max(0, vs.height - y - 640 * scale),
                  visible: block
                });
              }
            }
          },
          Update: function Update$3(dt) {
            var _app$g;
            app.clock += dt;
            var live = app.screen === 'game' && !app.activeTip && !app.adLoading;
            if (live !== playing) {
              playing = live;
              onGameplay(live);
            }
            UpdateContext(app.handbook ? app.handbook.origin : app.screen, (_app$g = app.g) == null ? void 0 : _app$g.run, dt);
            Update(dt);
            Update$1(app, dt);
            app.FitPage();
            drawOutside(app);
            Update$2(dt);
            if (app.toastTime > 0) {
              app.toastTime -= dt;
              var message = app.refs.message;
              if (app.toastTime <= 0 && message) message.Animate({
                keyframes: {
                  0: {
                    opacity: 1
                  },
                  1: {
                    opacity: 0
                  }
                },
                duration: .3,
                fillMode: 'forwards'
              });
            }
          }
        };
        install(app);
        return app;
      }

      // The page-outside area (Maker Design.lua D.PageFill): a page washed all over (settings) lays the same wash over the
      // fill, and translucent panels spanning the page's full width and at least 40% of its height (overlay masks, or
      // props.outsideDim for veils built from pieces) are repeated outside it, continuing to the screen edge where they
      // reach the page's top or bottom. Redrawn every frame, so fades and closing overlays follow.
      var outsideGraphics = null;
      var tallBands = null;
      var outsideBlockers = null;
      var lastAnchorFit = '';
      // The open modal: a visible full-page panel in the page that takes taps (an overlay's input-catching root), topmost.
      function modalOpen(page) {
        var found = null;
        var scan = function scan(w, depth) {
          for (var _iterator3 = _createForOfIteratorHelperLoose(w.children), _step3; !(_step3 = _iterator3()).done;) {
            var _c2 = _step3.value;
            if (_c2.props.onClick && !_c2.props.anchor) {
              var l = _c2.GetLayout();
              if (l.x <= .5 && l.y <= .5 && l.w >= 359.5 && l.h >= 639.5 && effectiveOpacity(_c2) > 0) found = _c2;
            }
            if (depth < 2) scan(_c2, depth + 1);
          }
        };
        scan(page, 0);
        return found;
      }
      var lastFitLog = '';
      function effectiveOpacity(w) {
        var o = 1;
        while (w) {
          var _w$renderProps_$visib, _ref, _w$renderProps_$opaci;
          var visible = (_w$renderProps_$visib = w.renderProps_.visible) != null ? _w$renderProps_$visib : w.props.visible;
          if (visible === false) return 0;
          o *= (_ref = (_w$renderProps_$opaci = w.renderProps_.opacity) != null ? _w$renderProps_$opaci : w.props.opacity) != null ? _ref : 1;
          w = w.parent;
        }
        return o;
      }
      function drawOutside(app) {
        var _wash$2;
        var g = outsideGraphics,
          page = app.page,
          root = app.root;
        if (!g || !g.isValid || !page || !root) return;
        g.clear();
        var p = page.GetAbsoluteLayout(),
          l = root.GetAbsoluteLayout();
        if (p.w >= l.w - 1 && p.h >= l.h - 1) return;
        // Rows y0-y1 across the screen, minus the page's own rectangle (the page draws its overlays itself).
        var rect = function rect(c, alpha, y0, y1) {
          g.fillColor = new Color(c[0], c[1], c[2], alpha);
          var any = false;
          var box = function box(x, top, w, bottom) {
            if (w > 0 && bottom > top) {
              g.rect(x, -bottom, w, bottom - top);
              any = true;
            }
          };
          box(l.x, y0, l.w, Math.min(y1, p.y));
          box(l.x, Math.max(y0, p.y + p.h), l.w, y1);
          var m0 = Math.max(y0, p.y),
            m1 = Math.min(y1, p.y + p.h);
          box(l.x, m0, p.x - l.x, m1);
          box(p.x + p.w, m0, l.x + l.w - p.x - p.w, m1);
          // A fill with no new path would fill the previous one again (Graphics starts a new path only at moveTo).
          if (any) g.fill();
        };
        var wash = page.props.fillWash;
        // fillWashEdges: the page's own wash strength at its top and bottom edge, used above and below the page (tall-screen
        // bands continue the page there); beside the page the one fillWash strength.
        var edges = page.props.fillWashEdges;
        if (wash && edges) {
          var _wash$;
          rect(wash, edges[0], l.y, p.y);
          rect(wash, (_wash$ = wash[3]) != null ? _wash$ : 255, p.y, p.y + p.h);
          rect(wash, edges[1], p.y + p.h, l.y + l.h);
        } else if (wash) rect(wash, (_wash$2 = wash[3]) != null ? _wash$2 : 255, l.y, l.y + l.h);
        var scan = function scan(w, depth) {
          for (var _iterator4 = _createForOfIteratorHelperLoose(w.children), _step4; !(_step4 = _iterator4()).done;) {
            var _c3$renderProps_$back, _color$;
            var _c3 = _step4.value;
            var dim = _c3.props.outsideDim;
            var color = dim != null ? dim : (_c3$renderProps_$back = _c3.renderProps_.backgroundColor) != null ? _c3$renderProps_$back : _c3.props.backgroundColor;
            var alpha = color ? (_color$ = color[3]) != null ? _color$ : 255 : 0;
            if (_c3 !== page && !_c3.props.outsideIgnore && alpha > 0 && (dim || alpha < 255)) {
              var a = _c3.GetAbsoluteLayout();
              if (Math.abs(a.x - p.x) < 2 && Math.abs(a.w - p.w) < 2 && a.h >= p.h * .4) {
                var y0 = Math.abs(a.y - p.y) < 2 ? l.y : a.y;
                var y1 = Math.abs(a.y + a.h - p.y - p.h) < 2 ? l.y + l.h : a.y + a.h;
                var value = Math.floor(alpha * effectiveOpacity(_c3) + .5);
                if (value > 0) rect(color, value, y0, y1);
              }
            }
            // A panel that declares outsideDim is drawn once as a whole; its pieces are not counted again.
            if (depth < 3 && !dim) scan(_c3, depth + 1);
          }
        };
        scan(root, 0);
      }
      function setLayerDeep(n, layer) {
        n.layer = layer;
        for (var _iterator5 = _createForOfIteratorHelperLoose(n.children), _step5; !(_step5 = _iterator5()).done;) {
          var _c4 = _step5.value;
          setLayerDeep(_c4, layer);
        }
      }
      function fixLayers(n, layer) {
        setLayerDeep(n, layer);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/assets.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './i18n.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, resources, JsonAsset, artLanguages, language;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      resources = module.resources;
      JsonAsset = module.JsonAsset;
    }, function (module) {
      artLanguages = module.artLanguages;
      language = module.language;
    }],
    execute: function () {
      exports({
        catalogIds: catalogIds,
        loadCatalog: loadCatalog,
        resolveAsset: resolveAsset
      });
      cclegacy._RF.push({}, "46852euUHlLlpgWP72neJPw", "assets", undefined);
      var catalog = {};
      function loadCatalog() {
        return new Promise(function (ok, fail) {
          return resources.load('catalog', JsonAsset, function (err, json) {
            if (err) {
              fail(err);
              return;
            }
            var data = json.json;
            if ((data == null ? void 0 : data.version) !== 1) {
              fail(new Error('catalog version'));
              return;
            }
            catalog = data.assets;
            ok();
          });
        });
      }
      // Language variants (art with lettering): "<id>@<lang>" wins over the source art when it exists (art/catalog-extra.json).
      // Languages without their own variant use the English one (artLanguages).
      function resolveAsset(id) {
        for (var _iterator = _createForOfIteratorHelperLoose(artLanguages(language())), _step; !(_step = _iterator()).done;) {
          var lang = _step.value;
          var hit = catalog[id + '@' + lang];
          if (hit) return hit;
        }
        return catalog[id];
      }
      function catalogIds(prefix) {
        return Object.keys(catalog).filter(function (k) {
          return k.startsWith(prefix);
        });
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        applySettings: applySettings,
        installAudio: installAudio,
        installAudioResume: installAudioResume,
        pauseAudio: pauseAudio,
        playCue: playCue,
        resumeAudio: resumeAudio,
        setHostMuted: setHostMuted,
        setMusic: setMusic
      });
      cclegacy._RF.push({}, "0e953dL1xZIPYTvj69f8Y40", "audio", undefined); // Audio gate (Maker repo scripts/Game/Audio.lua: PlayCue / SetMusic / Apply). The implementation is installed by the
      // platform layer; until then cues are ignored, so UI code can call it unconditionally.
      var impl = {
        playCue: function playCue() {},
        setMusic: function setMusic() {},
        apply: function apply() {}
      };
      function installAudio(a) {
        impl = a;
      }
      function playCue(id) {
        impl.playCue(id);
      }
      function setMusic(id) {
        impl.setMusic(id);
      }
      function applySettings(settings) {
        impl.apply(settings);
      }
      // Ads pause the game's sound while they play; the service resumes it when the request ends (Maker Audio.Resume).
      var resumeImpl = function resumeImpl() {};
      var pauseImpl = function pauseImpl() {};
      function installAudioResume(fn, pause) {
        resumeImpl = fn;
        if (pause) pauseImpl = pause;
      }
      // Portals require the game silent while an ad plays (CrazyGames adStarted, Poki rewardedBreak onStart).
      function pauseAudio(reason) {
        pauseImpl(reason);
      }
      function resumeAudio(reason) {
        if (!hostMuted) resumeImpl(reason);
      }
      // The host's own mute (YouTube Playables mute button): no sound at all while set, whatever the game's settings or ads do.
      var hostMuted = false;
      function setHostMuted(muted) {
        if (muted === hostMuted) return;
        hostMuted = muted;
        if (muted) pauseImpl('host-mute');else resumeImpl('host-mute');
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio2.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './assets.ts', './config.ts', './audio.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, Node, director, AudioSource, resources, AudioClip, resolveAsset, Cat, installAudio, installAudioResume;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      director = module.director;
      AudioSource = module.AudioSource;
      resources = module.resources;
      AudioClip = module.AudioClip;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      Cat = module.Cat;
    }, function (module) {
      installAudio = module.installAudio;
      installAudioResume = module.installAudioResume;
    }],
    execute: function () {
      exports({
        Apply: Apply,
        Init: Init,
        Pause: Pause,
        PlayCue: PlayCue,
        Preload: Preload,
        Resume: Resume,
        SetMusic: SetMusic,
        Update: Update,
        UpdateContext: UpdateContext
      });
      cclegacy._RF.push({}, "22fe29sDwhI/qjsHKxWhy41", "audio", undefined);
      var config = {
        busyAt: 20,
        calmAt: 30,
        recoverSeconds: 2,
        fadeOut: .35,
        fadeIn: .45,
        gain: .28,
        duckGain: .20
      };
      var CUE_GAIN = .65,
        CLUSTER = .06,
        PICK_QUIET = .35;
      var A = {
        music: true,
        sfx: true,
        track: '',
        current: '',
        clock: 0,
        lastCue: {},
        nextSource: 0,
        fade: 0,
        recent: [],
        duckUntil: undefined,
        pendingClick: undefined,
        pendingLand: undefined,
        deferred: [],
        quietUntil: 0,
        pickAt: undefined,
        pendingOrder: undefined,
        lastStartAt: undefined,
        catCallAt: undefined,
        orderAt: undefined,
        skillAt: undefined,
        runToken: undefined,
        busy: false,
        recovery: 0
      };
      var root = null;
      var cues = [];
      var announcement = null;
      var music = null;

      // Clips load once and stay cached; a cue whose clip is still loading is skipped (the Maker cache loads synchronously).
      var clips = {};
      var loading = {};
      function clip(id) {
        var item = resolveAsset(id);
        if (!item) return undefined;
        var hit = clips[item.path];
        if (hit) return hit;
        if (!loading[item.path]) {
          loading[item.path] = true;
          resources.load(item.path.replace(/\.(ogg|wav|mp3)$/i, ''), AudioClip, function (err, c) {
            if (err) {
              console.warn('[Audio] missing', item.path, err.message);
              return;
            }
            clips[item.path] = c;
          });
        }
        return undefined;
      }
      // Preload every catalog cue so the first plays are not lost.
      function Preload(ids) {
        for (var _iterator = _createForOfIteratorHelperLoose(ids), _step; !(_step = _iterator()).done;) {
          var id = _step.value;
          clip(id);
        }
      }
      function startCue(id, c) {
        var _A$duckUntil;
        if (A.pickAt !== undefined && A.clock - A.pickAt < PICK_QUIET && id !== 'sfx.upgrade_pick') {
          A.deferred.push({
            at: A.quietUntil,
            id: id,
            clip: c
          });
          return;
        }
        var source = id === 'sfx.order' ? announcement : cues[A.nextSource];
        if (!source) return;
        A.recent = A.recent.filter(function (t) {
          return A.clock - t < CLUSTER;
        });
        var n = A.recent.length;
        A.recent.push(A.clock);
        A.lastStartAt = A.clock;
        if (id === 'sfx.order') A.orderAt = A.clock;
        if (id === 'sfx.skill') A.skillAt = A.clock;
        source.stop();
        source.clip = c;
        source.loop = false;
        source.volume = CUE_GAIN / Math.sqrt(n + 1);
        source.play();
        if (id === 'sfx.upgrade_pick') {
          A.pickAt = A.clock;
          A.quietUntil = A.clock + PICK_QUIET;
        }
        // Music ducks under the order announcement and a cat's skill call.
        var m = /^sfx\.(.+)$/.exec(id);
        var catCall = m !== null && Cat(m[1]) !== undefined;
        if (catCall) {
          A.catCallAt = A.clock;
          if (A.pendingOrder) A.pendingOrder.at = Math.max(A.pendingOrder.at, A.clock + .45);
        }
        if (id === 'sfx.order' || id === 'sfx.assist' || catCall) A.duckUntil = Math.max((_A$duckUntil = A.duckUntil) != null ? _A$duckUntil : 0, A.clock + (id === 'sfx.order' ? 1.1 : .45));
        if (id !== 'sfx.order') A.nextSource = (A.nextSource + 1) % 3;
      }
      function PlayCue(id) {
        var _A$lastCue$id;
        if (paused || !A.sfx || A.clock - ((_A$lastCue$id = A.lastCue[id]) != null ? _A$lastCue$id : -10) < .08) return;
        var c = clip(id);
        if (!c) return;
        A.lastCue[id] = A.clock;
        if (A.pickAt !== undefined && A.clock - A.pickAt < PICK_QUIET && id !== 'sfx.upgrade_pick') {
          A.deferred.push({
            at: A.quietUntil,
            id: id,
            clip: c
          });
          return;
        }
        // A cat's call is heard on its own: for 0.3 s clear / time / land cues are dropped and the order waits.
        if (A.catCallAt !== undefined && A.clock - A.catCallAt < .3) {
          if (id === 'sfx.clear' || id === 'sfx.time' || id === 'sfx.land') return;
          if (id === 'sfx.order') {
            A.pendingOrder = {
              at: A.catCallAt + .45,
              clip: c
            };
            return;
          }
        }
        // The skill sound and the order announcement are heard on their own for 0.1 s; other cues wait 0.13 s after the order.
        if (id !== 'sfx.skill' && A.skillAt !== undefined && A.clock - A.skillAt < .1 && (id === 'sfx.clear' || id === 'sfx.time' || id === 'sfx.land')) return;
        if (id !== 'sfx.order' && A.orderAt !== undefined && A.clock - A.orderAt < .1) {
          if (id === 'sfx.clear' || id === 'sfx.time' || id === 'sfx.land') return;
          if (id !== 'sfx.click') {
            A.deferred.push({
              at: A.orderAt + .13,
              id: id,
              clip: c
            });
            return;
          }
        }
        // A click is held one frame and dropped if the button's own action cue starts in it; so is a refill landing.
        if (id === 'sfx.click') {
          A.pendingClick = c;
          return;
        }
        if (id === 'sfx.land') {
          A.pendingLand = c;
          return;
        }
        A.pendingClick = undefined;
        A.pendingLand = undefined;
        // The order announcement follows a just-started cue by 0.13 s instead of joining it.
        if (id === 'sfx.order' && A.lastStartAt !== undefined && A.clock - A.lastStartAt < .1) {
          A.pendingOrder = {
            at: A.lastStartAt + .13,
            clip: c
          };
          return;
        }
        startCue(id, c);
      }
      function SetMusic(id) {
        if (A.track !== (id != null ? id : '')) A.track = id != null ? id : '';
      }
      // The item detail overlay is part of the run and keeps the play track and busy state.
      function UpdateContext(screen, run, dt) {
        var inRun = run && (screen === 'game' || screen === 'pause' || screen === 'upgrade' || screen === 'item_detail');
        if (!inRun) {
          A.runToken = undefined;
          A.busy = false;
          A.recovery = 0;
          SetMusic('music.home');
          return;
        }
        if (A.runToken !== run) {
          A.runToken = run;
          A.busy = false;
          A.recovery = 0;
        }
        if (screen === 'game') {
          if (!A.busy && run.time <= config.busyAt) {
            A.busy = true;
            A.recovery = 0;
          } else if (A.busy) {
            if (run.time >= config.calmAt) {
              A.recovery += dt;
              if (A.recovery >= config.recoverSeconds) {
                A.busy = false;
                A.recovery = 0;
              }
            } else A.recovery = 0;
          }
        }
        SetMusic(A.busy ? 'music.play.busy' : 'music.play');
      }
      function releaseMusic() {
        var _music;
        (_music = music) == null || _music.stop();
        A.current = '';
        A.fade = 0;
      }
      function startMusic() {
        if (!music || !A.music || A.track === '') return;
        var c = clip(A.track);
        if (!c) {
          return;
        }
        music.stop();
        music.clip = c;
        music.loop = true;
        music.volume = 0;
        music.play();
        A.current = A.track;
        A.fade = 0;
      }
      function Apply(settings) {
        A.music = settings.music;
        A.sfx = settings.sfx;
        if (!A.music) releaseMusic();
      }
      function Update(dt) {
        A.clock += dt;
        if (A.pendingClick) {
          var c = A.pendingClick;
          A.pendingClick = undefined;
          startCue('sfx.click', c);
        }
        if (A.pendingLand) {
          var _c = A.pendingLand;
          A.pendingLand = undefined;
          startCue('sfx.land', _c);
        }
        // A due order announcement re-checks for a cue started in the last 0.1 s and then waits 0.13 s after it.
        if (A.pendingOrder && A.clock >= A.pendingOrder.at) {
          if (A.lastStartAt !== undefined && A.clock - A.lastStartAt < .1) A.pendingOrder.at = A.lastStartAt + .13;else {
            var o = A.pendingOrder;
            A.pendingOrder = undefined;
            startCue('sfx.order', o.clip);
          }
        }
        if (A.deferred.length > 0) {
          var list = A.deferred;
          A.deferred = [];
          for (var _iterator2 = _createForOfIteratorHelperLoose(list), _step2; !(_step2 = _iterator2()).done;) {
            var _c2 = _step2.value;
            if (A.clock >= _c2.at) startCue(_c2.id, _c2.clip);else A.deferred.push(_c2);
          }
        }
        if (A.duckUntil !== undefined && A.clock >= A.duckUntil) A.duckUntil = undefined;
        if (paused || !A.music || !music) return;
        var level = function level() {
          return A.fade * (A.duckUntil !== undefined ? config.duckGain : config.gain);
        };
        if (A.current !== A.track) {
          if (A.current !== '') {
            A.fade = Math.max(0, A.fade - dt / config.fadeOut);
            music.volume = level();
            if (A.fade > 0) return;
            releaseMusic();
          }
          startMusic();
          return;
        }
        if (!music.playing && A.track !== '') {
          startMusic();
          return;
        }
        A.fade = Math.min(1, A.fade + dt / config.fadeIn);
        music.volume = level();
      }
      // An ad starts: everything goes quiet until the request ends (Resume).
      var paused = false;
      function Pause(reason) {
        var _music2, _announcement;
        console.log('[Audio] pause reason=' + reason);
        paused = true;
        (_music2 = music) == null || _music2.pause();
        for (var _iterator3 = _createForOfIteratorHelperLoose(cues), _step3; !(_step3 = _iterator3()).done;) {
          var c = _step3.value;
          c.stop();
        }
        (_announcement = announcement) == null || _announcement.stop();
      }
      // Ads end: continue the loop (or restart it if the host stopped it).
      function Resume(reason) {
        console.log('[Audio] resume reason=' + reason);
        if (!paused) {
          if (A.music && music && A.track !== '' && !music.playing) A.current = '';
          return;
        }
        paused = false;
        if (A.music && music && A.current !== '') music.play();
      }
      function Init(settings) {
        A.music = settings.music;
        A.sfx = settings.sfx;
        root = new Node('Audio');
        director.getScene().addChild(root);
        director.addPersistRootNode(root);
        var voice = function voice(name) {
          var n = new Node(name);
          root.addChild(n);
          return n.addComponent(AudioSource);
        };
        cues = [voice('Cue1'), voice('Cue2'), voice('Cue3')];
        announcement = voice('OrderAnnouncement');
        music = voice('Music');
        installAudio({
          playCue: PlayCue,
          setMusic: SetMusic,
          apply: Apply
        });
        installAudioResume(Resume, Pause);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/authority.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts', './run.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, SIZE, RULE_VERSION, Cat, Run;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SIZE = module.SIZE;
      RULE_VERSION = module.RULE_VERSION;
      Cat = module.Cat;
    }, function (module) {
      Run = module.Run;
    }],
    execute: function () {
      exports('Verify', Verify);
      cclegacy._RF.push({}, "18a1bxk7ntPdKCxnmVgXQwJ", "authority", undefined);
      var Authority = exports('Authority', /*#__PURE__*/function () {
        function Authority(seed, equipped, levels) {
          this.run = void 0;
          this.sequence = 0;
          if (!(Number.isInteger(seed) && seed > 0 && seed < 2147483647)) throw new Error('server seed required');
          if (!(Array.isArray(equipped) && equipped.length >= 1 && equipped.length <= 2)) throw new Error('invalid server loadout');
          var seen = {};
          for (var _iterator = _createForOfIteratorHelperLoose(equipped), _step; !(_step = _iterator()).done;) {
            var id = _step.value;
            if (!Cat(id) || seen[id]) throw new Error('invalid server cat');
            seen[id] = true;
            var level = levels == null ? void 0 : levels[id];
            if (!(Number.isInteger(level) && level >= 1 && level <= 5)) throw new Error('server level required');
          }
          this.run = new Run(seed, equipped, levels);
        }
        // dt must come from the server clock. Do not pass client payload elapsed/delta.
        var _proto = Authority.prototype;
        _proto.Tick = function Tick(dt) {
          if (typeof dt !== 'number' || dt < 0 || dt >= Infinity) return [false, 'invalid server timestep'];
          this.run.Update(dt);
          this.run.DrainEvents();
          return [true];
        };
        _proto.Command = function Command(sequence, command) {
          var _reason;
          if (typeof sequence !== 'number' || sequence !== this.sequence + 1 || typeof command !== 'object' || command === null) return [false, 'invalid sequence'];
          var accepted = false;
          var reason;
          if (command.type === 'swap' || command.type === 'rainbow_tap') {
            var coordinates = command.type === 'swap' ? ['r', 'c', 'rr', 'cc'] : ['r', 'c'];
            for (var _i = 0, _coordinates = coordinates; _i < _coordinates.length; _i++) {
              var k = _coordinates[_i];
              var v = command[k];
              if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > SIZE) return [false, 'invalid coordinate'];
            }
            if (command.type === 'rainbow_tap') accepted = this.run.TapRainbow(command.r, command.c);else accepted = this.run.Swap(command.r, command.c, command.rr, command.cc);
          } else if (command.type === 'upgrade' && typeof command.id === 'string') {
            accepted = this.run.ChooseUpgrade(command.id, command.replace);
          } else if (command.type === 'reroll') {
            var _this$run$TryReroll = this.run.TryReroll();
            accepted = _this$run$TryReroll[0];
            reason = _this$run$TryReroll[1];
          } else if (command.type === 'reroll_ad') {
            // Consistency replay only; a public server transport must authenticate the ad grant first.
            var _this$run$GrantReroll = this.run.GrantRerollAd();
            accepted = _this$run$GrantReroll[0];
            reason = _this$run$GrantReroll[1];
          } else if (command.type === 'finish') {
            // Player ended the run early from pause; only legal once the board has settled.
            if (this.run.phase === 'idle' || this.run.phase === 'upgrade') {
              this.run.Finish(true);
              accepted = true;
            }
          } else return [false, 'invalid command'];
          this.sequence = sequence; // consumed commands cannot be applied twice, including rejected swaps
          if (!accepted) return [false, (_reason = reason) != null ? _reason : 'action not legal in current state'];
          return [true];
        };
        _proto.Result = function Result(claimedScore) {
          if (this.run.phase !== 'finished') return [null, 'run not finished'];
          if (claimedScore !== undefined && claimedScore !== this.run.score) return [null, 'score mismatch'];
          return [{
            score: this.run.score,
            completedOrders: this.run.completedOrders
          }];
        };
        return Authority;
      }());
      function finite(v) {
        return typeof v === 'number' && v >= 0 && v < Infinity;
      }
      function Verify(initial, replay) {
        if (typeof initial !== 'object' || typeof replay !== 'object' || !Array.isArray(replay.actions) || replay.actions.length > 10000 || !finite(replay.idleElapsed) || replay.ruleVersion !== RULE_VERSION) return [false, 'invalid replay envelope or rule version'];
        var session;
        try {
          session = new Authority(initial.seed, initial.equipped, initial.levels);
        } catch (_unused) {
          return [false, 'invalid initial state'];
        }
        var run = session.run;
        var budget = 100000;
        var settle = function settle() {
          while (run.phase !== 'idle' && run.phase !== 'upgrade' && run.phase !== 'finished') {
            budget--;
            if (budget <= 0) return false;
            session.Tick(Math.max(run.phaseRemaining, 0.000001));
          }
          return true;
        };
        var waitUntil = function waitUntil(target) {
          if (!finite(target) || target + 0.000001 < run.idleElapsed) return false;
          var dt = Math.max(0, target - run.idleElapsed);
          if (dt > 0) {
            if (run.phase !== 'idle') return false;
            session.Tick(dt);
          }
          return Math.abs(target - run.idleElapsed) < 0.00001;
        };
        for (var i = 0; i < replay.actions.length; i++) {
          var action = replay.actions[i];
          if (typeof action !== 'object' || !settle() || !waitUntil(action.idleElapsed)) return [false, "invalid action time at " + (i + 1)];
          var _session$Command = session.Command(i + 1, action),
            accepted = _session$Command[0],
            _err = _session$Command[1];
          if (!accepted) return [false, "rejected action " + (i + 1) + ": " + _err];
        }
        if (!settle() || !waitUntil(replay.idleElapsed)) return [false, 'invalid final time'];
        var _session$Result = session.Result(replay.score),
          result = _session$Result[0],
          err = _session$Result[1];
        if (!result) return [false, err];
        if (result.completedOrders !== replay.completedOrders) return [false, 'order count mismatch'];
        return [true, result];
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/board.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, SIZE, goods;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SIZE = module.SIZE;
      goods = module.goods;
    }],
    execute: function () {
      exports({
        Copy: Copy,
        EnsureMove: EnsureMove,
        Fall: Fall,
        FindMove: FindMove,
        Inside: Inside,
        Matches: Matches,
        New: New,
        RainbowTapKind: RainbowTapKind,
        Swap: Swap,
        ValidSwap: ValidSwap,
        emptyBoard: emptyBoard
      });
      cclegacy._RF.push({}, "b152f3bw8FOSqQIZL3LPNjK", "board", undefined);
      var N = SIZE;
      function emptyBoard() {
        var b = [];
        for (var r = 0; r <= N; r++) b.push(new Array(N + 1).fill(undefined));
        return b;
      }
      function Copy(board) {
        var result = emptyBoard();
        for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
          var cell = board[r][c];
          if (cell) result[r][c] = {
            kind: cell.kind,
            special: cell.special,
            uid: cell.uid,
            credited: cell.credited,
            origin: cell.origin
          };
        }
        return result;
      }
      function Inside(r, c) {
        return typeof r === 'number' && typeof c === 'number' && Number.isInteger(r) && Number.isInteger(c) && r >= 1 && r <= N && c >= 1 && c <= N;
      }
      function Swap(board, r, c, rr, cc) {
        var t = board[r][c];
        board[r][c] = board[rr][cc];
        board[rr][cc] = t;
      }

      // Rainbow pieces have no ordinary good to choose; other specials still carry their good kind.
      function RainbowTapKind(board, preferences) {
        var counts = {};
        for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
          var _counts$cell$kind;
          var cell = board[r][c];
          if (cell && cell.special !== 'rainbow') counts[cell.kind] = ((_counts$cell$kind = counts[cell.kind]) != null ? _counts$cell$kind : 0) + 1;
        }
        for (var _iterator = _createForOfIteratorHelperLoose(preferences), _step; !(_step = _iterator()).done;) {
          var _counts$_kind2;
          var _kind2 = _step.value;
          if (((_counts$_kind2 = counts[_kind2]) != null ? _counts$_kind2 : 0) > 0) return _kind2;
        }
        var best = 1,
          most = 0;
        for (var _kind = 1; _kind <= goods.length; _kind++) {
          var _counts$_kind;
          if (((_counts$_kind = counts[_kind]) != null ? _counts$_kind : 0) > most) {
            best = _kind;
            most = counts[_kind];
          }
        }
        return best;
      }

      // Runs are kept separately so intersections yield bombs and lines keep their orientation.
      function Matches(board) {
        var runs = [];
        for (var _iterator2 = _createForOfIteratorHelperLoose([1, 2]), _step2; !(_step2 = _iterator2()).done;) {
          var axis = _step2.value;
          for (var a = 1; a <= N; a++) {
            var start = 1;
            while (start <= N) {
              var r = axis === 2 ? start : a,
                c = axis === 2 ? a : start;
              var cell = board[r][c];
              var stop = start + 1;
              if (cell && cell.special !== 'rainbow') {
                while (stop <= N) {
                  var other = axis === 1 ? board[a][stop] : board[stop][a];
                  if (!other || other.special === 'rainbow' || other.kind !== cell.kind) break;
                  stop++;
                }
                if (stop - start >= 3) {
                  var run = {
                    axis: axis,
                    kind: cell.kind,
                    cells: []
                  };
                  for (var i = start; i <= stop - 1; i++) run.cells.push(axis === 1 ? {
                    r: a,
                    c: i
                  } : {
                    r: i,
                    c: a
                  });
                  runs.push(run);
                }
              }
              start = stop;
            }
          }
        }
        return runs;
      }
      function ValidSwap(board, r, c, rr, cc) {
        if (!Inside(r, c) || !Inside(rr, cc) || Math.abs(r - rr) + Math.abs(c - cc) !== 1) return false;
        var a = board[r][c],
          b = board[rr][cc];
        if (!a || !b) return false;
        if (a.special === 'rainbow' || b.special === 'rainbow') return true;
        Swap(board, r, c, rr, cc);
        var valid = Matches(board).length > 0;
        Swap(board, r, c, rr, cc);
        return valid;
      }
      function FindMove(board) {
        for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
          if (c < N && ValidSwap(board, r, c, r, c + 1)) return [r, c, r, c + 1];
          if (r < N && ValidSwap(board, r, c, r + 1, c)) return [r, c, r + 1, c];
        }
        return undefined;
      }
      function New(random, newCell) {
        var board = emptyBoard();
        for (var r = 1; r <= N; r++) {
          for (var c = 1; c <= N; c++) {
            var _kind3 = random(5);
            while (c > 2 && board[r][c - 1].kind === _kind3 && board[r][c - 2].kind === _kind3 || r > 2 && board[r - 1][c].kind === _kind3 && board[r - 2][c].kind === _kind3) _kind3 = _kind3 % 5 + 1;
            board[r][c] = newCell(_kind3);
          }
        }
        EnsureMove(board, random);
        return board;
      }
      function EnsureMove(board, random, poolIn) {
        var pool = poolIn != null ? poolIn : [1, 2, 3, 4, 5];
        if (FindMove(board)) return false;
        // Preserve every cell and special while shuffling. Very rare exhausted shuffles recolor ordinary goods only.
        var cells = [];
        for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) cells.push(board[r][c]);
        for (var attempt = 1; attempt <= 200; attempt++) {
          for (var i = cells.length; i >= 2; i--) {
            var j = random(i);
            var t = cells[i - 1];
            cells[i - 1] = cells[j - 1];
            cells[j - 1] = t;
          }
          for (var _r = 1; _r <= N; _r++) for (var _c = 1; _c <= N; _c++) board[_r][_c] = cells[(_r - 1) * N + _c - 1];
          if (Matches(board).length === 0 && FindMove(board)) return true;
        }
        // A deterministic patterned board with an embedded legal move and no matches.
        for (var _r2 = 1; _r2 <= N; _r2++) for (var _c2 = 1; _c2 <= N; _c2++) board[_r2][_c2].kind = pool[(_r2 + _c2) % pool.length];
        board[1][1].kind = pool[0];
        board[1][2].kind = pool[1];
        board[1][3].kind = pool[0];
        board[2][2].kind = pool[0];
        return true;
      }
      function Fall(board, random, newCell) {
        var moves = [];
        for (var c = 1; c <= N; c++) {
          var dest = N;
          for (var r = N; r >= 1; r--) {
            var cell = board[r][c];
            if (cell) {
              board[r][c] = undefined;
              board[dest][c] = cell;
              if (r !== dest) moves.push({
                uid: cell.uid,
                fromRow: r,
                toRow: dest,
                col: c
              });
              dest--;
            }
          }
          for (var _r3 = dest; _r3 >= 1; _r3--) {
            var _cell = newCell(random(5));
            board[_r3][c] = _cell;
            moves.push({
              uid: _cell.uid,
              fromRow: _r3 - dest,
              toRow: _r3,
              col: c
            });
          }
        }
        return moves;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/buildRules.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _extends, cclegacy, routes, Cat, ITEM_TUNING, upgrades;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      routes = module.routes;
      Cat = module.Cat;
      ITEM_TUNING = module.ITEM_TUNING;
      upgrades = module.upgrades;
    }],
    execute: function () {
      exports({
        AfterRefill: AfterRefill,
        BasePool: BasePool,
        BeforeRefill: BeforeRefill,
        Bonus: Bonus,
        Collected: Collected,
        Convert: Convert,
        Count: Count,
        HasCat: HasCat,
        HasOwnCat: HasOwnCat,
        OnMatches: OnMatches,
        OnOrder: OnOrder,
        OnSpecial: OnSpecial,
        Place: Place,
        Pool: Pool,
        Queue: Queue,
        RefillChance: RefillChance,
        RefillKind: RefillKind,
        RefillWeights: RefillWeights,
        Refresh: Refresh,
        SourceSlot: SourceSlot
      });
      cclegacy._RF.push({}, "590bcKgAFtGppgcA4HwxtOG", "buildRules", undefined);
      function copyCell(cell) {
        return _extends({}, cell);
      }
      function Count(run, route) {
        var n = 0;
        for (var _iterator = _createForOfIteratorHelperLoose(upgrades), _step; !(_step = _iterator()).done;) {
          var u = _step.value;
          if (run.ownedUpgrades[u.id] && (!route || u.route === route)) n++;
        }
        return n;
      }
      function HasOwnCat(run, route) {
        for (var _iterator2 = _createForOfIteratorHelperLoose(run.cats), _step2; !(_step2 = _iterator2()).done;) {
          var cat = _step2.value;
          if (cat.id === routes[route].cat) return true;
        }
        return false;
      }
      function HasCat(run, route) {
        if (HasOwnCat(run, route)) return true;
        if (route === 'general') return false;
        for (var _iterator3 = _createForOfIteratorHelperLoose(run.cats), _step3; !(_step3 = _iterator3()).done;) {
          var cat = _step3.value;
          if (Cat(cat.id).universalPartner) return true;
        }
        return false;
      }
      // All five goods in this run's rotation (run.featureKind is only the rotation start).
      function BasePool(run) {
        var pool = [];
        for (var offset = 0; offset <= 4; offset++) pool.push((run.featureKind - 1 + offset) % 5 + 1);
        return pool;
      }
      function Pool(run) {
        // 精简货架: four goods including the two 偏好品.
        var count = run.ownedUpgrades.display_filter ? 4 : 5;
        var base = BasePool(run);
        if (count >= 5) return base;
        var p = run.Preferences();
        var pool = [p[0], p[1]];
        for (var _iterator4 = _createForOfIteratorHelperLoose(base), _step4; !(_step4 = _iterator4()).done;) {
          var kind = _step4.value;
          if (pool.length < count && kind !== p[0] && kind !== p[1]) pool.push(kind);
        }
        return pool;
      }
      function Queue(run, special, origin) {
        run.refillTools.push({
          special: special,
          origin: origin
        });
      }
      // Only random replenishment is weighted. Restricted pools and guaranteed goods win.
      function RefillWeights(run, additional) {
        var pool = Pool(run);
        var weights = {};
        for (var _iterator5 = _createForOfIteratorHelperLoose(pool), _step5; !(_step5 = _iterator5()).done;) {
          var kind = _step5.value;
          weights[kind] = 2;
        }
        for (var _iterator6 = _createForOfIteratorHelperLoose(upgrades), _step6; !(_step6 = _iterator6()).done;) {
          var u = _step6.value;
          if (u.refillKind && (run.ownedUpgrades[u.id] || u.id === additional) && weights[u.refillKind]) {
            weights[u.refillKind] = weights[u.refillKind] * u.refillMultiplier;
          }
        }
        var total = 0;
        for (var _iterator7 = _createForOfIteratorHelperLoose(pool), _step7; !(_step7 = _iterator7()).done;) {
          var _kind = _step7.value;
          total += weights[_kind];
        }
        return [pool, weights, total];
      }
      function RefillChance(run, kind, additional) {
        var _weights$kind;
        var _RefillWeights = RefillWeights(run, additional),
          weights = _RefillWeights[1],
          total = _RefillWeights[2];
        return ((_weights$kind = weights[kind]) != null ? _weights$kind : 0) / total;
      }
      function Place(run, special, origin) {
        var _run$metrics$generate;
        var choices = [];
        for (var r = 1; r <= 7; r++) for (var c = 1; c <= 7; c++) {
          var _cell = run.board[r][c];
          if (_cell && !_cell.special) choices.push({
            r: r,
            c: c
          });
        }
        if (choices.length === 0) return [false];
        var p = choices[run.Random(choices.length) - 1];
        var cell = run.board[p.r][p.c];
        var before = copyCell(cell);
        cell.special = special;
        cell.origin = origin;
        run.metrics.generated[origin] = ((_run$metrics$generate = run.metrics.generated[origin]) != null ? _run$metrics$generate : 0) + 1;
        return [true, {
          r: p.r,
          c: p.c,
          before: before,
          after: copyCell(cell)
        }];
      }
      function SourceSlot(run, origin) {
        var m = /^item:(.+)$/.exec(origin);
        if (!m) return undefined;
        var i = run.upgradeOrder.indexOf(m[1]);
        return i >= 0 ? i + 1 : undefined;
      }
      function Convert(run, count, origin) {
        var _run$metrics$converte;
        var changed = 0;
        var targets = [];
        var kind = run.Preferences()[0];
        for (var r = 7; r >= 1; r--) for (var c = 1; c <= 7; c++) {
          var cell = run.board[r][c];
          if (changed < count && cell && !cell.special && cell.kind !== kind) {
            var before = copyCell(cell);
            cell.kind = kind;
            cell.origin = origin;
            changed++;
            targets.push({
              r: r,
              c: c,
              before: before,
              after: copyCell(cell),
              flip: true
            });
          }
        }
        run.metrics.converted[origin] = ((_run$metrics$converte = run.metrics.converted[origin]) != null ? _run$metrics$converte : 0) + changed;
        return {
          origin: origin,
          slot: SourceSlot(run, origin),
          wave: run.elapsed,
          targets: targets
        };
      }
      function OnMatches(run, runs) {
        if (!run.exchange.player || run.exchange.cascade !== 1) return;
        if (run.ownedUpgrades.ribbon_spool) {
          for (var _iterator8 = _createForOfIteratorHelperLoose(runs), _step8; !(_step8 = _iterator8()).done;) {
            var match = _step8.value;
            if (match.cells.length === 4) {
              Queue(run, match.axis === 1 ? 'row' : 'column', 'item:ribbon_spool');
              break;
            }
          }
        }
        // One bomb every ITEM_TUNING.foamEvery clearing swaps.
        if (run.ownedUpgrades.bake_foam && runs.length > 0) {
          var _run$foamCharge;
          run.foamCharge = ((_run$foamCharge = run.foamCharge) != null ? _run$foamCharge : 0) + 1;
          if (run.foamCharge >= ITEM_TUNING.foamEvery) {
            run.foamCharge = 0;
            Queue(run, 'bomb', 'item:bake_foam');
          }
        }
      }
      // Items that pay points into the current order after N of something; paid by Run.Clear with the clear's own score.
      var TIMERS = {
        display_rush: {
          field: 'rushCharge',
          every: 'rushEvery'
        },
        bake_timer: {
          field: 'timerCharge',
          every: 'specialEvery'
        },
        ribbon_measure: {
          field: 'measureCharge',
          every: 'ribbonEvery'
        }
      };
      function tickTimer(run, id) {
        var _run$t$field;
        if (!run.ownedUpgrades[id]) return;
        var t = TIMERS[id];
        var every = ITEM_TUNING[t.every];
        run[t.field] = ((_run$t$field = run[t.field]) != null ? _run$t$field : 0) + 1;
        if (run[t.field] >= every) {
          var _run$counterPending$i;
          run[t.field] = run[t.field] - every;
          run.counterPending[id] = ((_run$counterPending$i = run.counterPending[id]) != null ? _run$counterPending$i : 0) + ITEM_TUNING.counterScore;
        }
      }
      function OnOrder(run) {
        if (run.ownedUpgrades.display_sample) run.sampleQueued = run.sampleQueued + ITEM_TUNING.sampleConvert;
        if (run.ownedUpgrades.bake_oven) Queue(run, 'bomb', 'item:bake_oven');
        // Alternating row / column (no RNG).
        if (run.ownedUpgrades.ribbon_bow) {
          for (var i = 1; i <= ITEM_TUNING.bowCount; i++) {
            var _run$bowCount;
            run.bowCount = ((_run$bowCount = run.bowCount) != null ? _run$bowCount : 0) + 1;
            Queue(run, run.bowCount % 2 === 1 ? 'row' : 'column', 'item:ribbon_bow');
          }
        }
      }
      function OnSpecial(run, special) {
        var _run$exchange$route;
        var route = special === 'row' || special === 'column' ? 'ribbon' : special === 'bomb' ? 'bake' : undefined;
        if (!route) return;
        if (route === 'bake') tickTimer(run, 'bake_timer');
        tickTimer(run, 'ribbon_measure');
        run.exchange[route] = ((_run$exchange$route = run.exchange[route]) != null ? _run$exchange$route : 0) + 1;
        var id = route === 'ribbon' ? 'ribbon_relay' : 'bake_core';
        if (!run.ownedUpgrades[id]) return;
        run.relay[route] = run.relay[route] + 1;
        var T = ITEM_TUNING;
        var every = route === 'ribbon' ? T.relayEvery : T.coreEvery,
          give = route === 'ribbon' ? T.relayGive : T.coreGive;
        if (run.relay[route] >= every) {
          run.relay[route] = run.relay[route] - every;
          for (var i = 1; i <= give; i++) Queue(run, route === 'ribbon' ? 'row' : 'bomb', 'item:' + id);
        }
      }
      function Bonus(run, base, hit, kind) {
        var result = {};
        var owned = run.ownedUpgrades;
        var add = function add(id, factor) {
          if (owned[id]) result['item:' + id] = Math.floor(base * factor + .000001);
        };
        var T = ITEM_TUNING;
        if (hit.line) {
          var _run$exchange$ribbon;
          add('ribbon_tip', T.tip);
          add('ribbon_finale', Math.min(T.finaleMax, Math.max(0, ((_run$exchange$ribbon = run.exchange.ribbon) != null ? _run$exchange$ribbon : 0) - 1) * T.finaleStep));
        }
        if (hit.bomb) {
          var _run$exchange$bake;
          add('bake_caramel', T.caramel);
          add('bake_candle', Math.min(T.candleMax, Math.max(0, ((_run$exchange$bake = run.exchange.bake) != null ? _run$exchange$bake : 0) - 1) * T.candleStep));
        }
        if (run.IsPreferred(kind) && run.exchange.cascade >= 3) add('display_regular', T.regular);
        if (run.IsPreferred(kind)) add('display_tag', T.tag);
        return result;
      }
      function Collected(run, kind) {
        if (run.exchange.player && run.ownedUpgrades.ribbon_spool) {
          run.spoolCharge = run.spoolCharge + 1;
          if (run.spoolCharge >= ITEM_TUNING.spoolEvery) {
            run.spoolCharge = run.spoolCharge - ITEM_TUNING.spoolEvery;
            Queue(run, 'row', 'item:ribbon_spool');
          }
        }
        if (!run.IsPreferred(kind)) return;
        tickTimer(run, 'display_rush');
        if (run.ownedUpgrades.display_window) {
          run.windowCharge = run.windowCharge + 1;
          var T = ITEM_TUNING;
          if (run.windowCharge >= T.windowEvery) {
            run.windowCharge = run.windowCharge - T.windowEvery;
            run.featureRefill = run.featureRefill + T.windowRefill;
          }
        }
      }
      function BeforeRefill(_run) {}
      function RefillKind(run) {
        // 热销橱窗's guaranteed 偏好品 refills.
        if (run.featureRefill > 0) {
          run.featureRefill = run.featureRefill - 1;
          run.refillOrigin = 'item:display_window';
          return run.Preferences()[0];
        }
        var _RefillWeights2 = RefillWeights(run),
          pool = _RefillWeights2[0],
          weights = _RefillWeights2[1],
          total = _RefillWeights2[2];
        run.refillOrigin = undefined;
        var uniform = true;
        for (var _iterator9 = _createForOfIteratorHelperLoose(pool), _step9; !(_step9 = _iterator9()).done;) {
          var kind = _step9.value;
          if (weights[kind] !== weights[pool[0]]) {
            uniform = false;
            break;
          }
        }
        if (uniform) return pool[run.Random(pool.length) - 1];
        var roll = run.Random(total);
        for (var _iterator10 = _createForOfIteratorHelperLoose(pool), _step10; !(_step10 = _iterator10()).done;) {
          var _kind2 = _step10.value;
          roll = roll - weights[_kind2];
          if (roll <= 0) return _kind2;
        }
        throw new Error('RefillKind: weighted roll fell through');
      }
      function AfterRefill(run) {
        var vfx = [];
        for (var _iterator11 = _createForOfIteratorHelperLoose(run.refillTools), _step11; !(_step11 = _iterator11()).done;) {
          var tool = _step11.value;
          var _Place = Place(run, tool.special, tool.origin),
            ok = _Place[0],
            p = _Place[1];
          if (ok) vfx.push({
            origin: tool.origin,
            slot: SourceSlot(run, tool.origin),
            wave: run.elapsed,
            targets: [p]
          });
        }
        run.refillTools = [];
        if (run.exchange.player && !run.exchange.paired && run.ownedUpgrades.display_pair) {
          run.exchange.paired = true;
          vfx.push(Convert(run, 1, 'item:display_pair'));
        }
        if (run.sampleQueued > 0) {
          vfx.push(Convert(run, run.sampleQueued, 'item:display_sample'));
          run.sampleQueued = 0;
        }
        return vfx;
      }
      function Refresh(_run) {}
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/cats.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './skin.ts', './design.ts', './catView.ts', './config.ts', './i18n.ts', './assets.ts', './audio.ts', './home.ts', './text.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, ImageStrips, UI, Text, ink, Image, Face, ImageButton, FaceText, Row, cream, muted, Block, AnchorGroup, Create, Play, IsReleasedCat, Cat, cats, CatLevelCost, SkillIcon, SkillText, CatLevel, SkillValue, L, resolveAsset, setMusic, base, pointsSign, fitText, textWidth, formatNumber, phraseLines, fitSize, wrap;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ImageStrips = module.ImageStrips;
      UI = module.UI;
    }, function (module) {
      Text = module.Text;
      ink = module.ink;
      Image = module.Image;
      Face = module.Face;
      ImageButton = module.ImageButton;
      FaceText = module.FaceText;
      Row = module.Row;
      cream = module.cream;
      muted = module.muted;
      Block = module.Block;
    }, function (module) {
      AnchorGroup = module.AnchorGroup;
    }, function (module) {
      Create = module.Create;
      Play = module.Play;
    }, function (module) {
      IsReleasedCat = module.IsReleasedCat;
      Cat = module.Cat;
      cats = module.cats;
      CatLevelCost = module.CatLevelCost;
      SkillIcon = module.SkillIcon;
      SkillText = module.SkillText;
      CatLevel = module.CatLevel;
      SkillValue = module.SkillValue;
    }, function (module) {
      L = module.L;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      setMusic = module.setMusic;
    }, function (module) {
      base = module.base;
      pointsSign = module.pointsSign;
    }, function (module) {
      fitText = module.fitText;
      textWidth = module.textWidth;
      formatNumber = module.formatNumber;
      phraseLines = module.phraseLines;
      fitSize = module.fitSize;
      wrap = module.wrap;
    }],
    execute: function () {
      exports('Cats', Cats);
      cclegacy._RF.push({}, "fe5d51+quJNHZihofyafpbC", "cats", undefined);
      var ZW = '​';

      // The blank title plaques are baked into the scene: redraw its upper-left region with the hanging part lengthened
      // (y<64 maps the image at 1024 high) and the rest moved down 24 (640 high), fading out at x170-210 and y178-202.
      function titleRegion() {
        var _asset$width, _asset$height;
        var asset = resolveAsset('scene.cats.r02');
        var tw = (_asset$width = asset.width) != null ? _asset$width : 1080,
          th = (_asset$height = asset.height) != null ? _asset$height : 1920;
        var k = tw / 360;
        var columns = [[0, 170, 1]];
        for (var x = 170; x < 210; x++) columns.push([x, 1, 1 - (x + .5 - 170) / 40]);
        var rows = [[0, 64, 1, 1024], [64, 114, 1, 640]];
        for (var y = 178; y < 202; y += 4) rows.push([y, Math.min(4, 202 - y), 1 - (y + Math.min(4, 202 - y) / 2 - 178) / 24, 640]);
        var strips = [];
        for (var _i = 0, _columns = columns; _i < _columns.length; _i++) {
          var _columns$_i = _columns[_i],
            cx = _columns$_i[0],
            cw = _columns$_i[1],
            ca = _columns$_i[2];
          for (var _iterator = _createForOfIteratorHelperLoose(rows), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              ry = _step$value[0],
              rh = _step$value[1],
              ra = _step$value[2],
              ph = _step$value[3];
            var py = ph === 1024 ? 0 : 24;
            var vk = th / ph;
            strips.push({
              x: cx,
              y: ry,
              w: cw,
              h: rh,
              sx: cx * k,
              sy: (ry - py) * vk,
              sw: cw * k,
              sh: rh * vk,
              alpha: ca * ra
            });
          }
        }
        return ImageStrips(asset.path, 0, 0, 210, 202, strips);
      }

      // Places content so its vertical centre is the plate's face centre (Maker centreOnPlate).
      function centreOnPlate(content, plateTop, plateH, id, contentH) {
        var _safeArea;
        var sa = (_safeArea = resolveAsset(id).safeArea) != null ? _safeArea : [0, 0, 0, 0];
        content.SetStyle({
          top: plateTop + plateH * (1 + sa[1] - sa[3]) / 2 - contentH / 2
        });
        return content;
      }
      function Cats(app) {
        var _C$Cat, _resolveAsset$safeAre2, _resolveAsset2;
        setMusic('music.home');
        var _base = base(app, 'cats', 'cats.r02'),
          page = _base[0];
        var selectable = function selectable(id) {
          return IsReleasedCat(id) || app.profile.cats[id] !== undefined;
        };
        var pick = app.selectedCat;
        if (!pick || !selectable(pick)) pick = app.profile.equipped[0];
        var def = (_C$Cat = Cat(pick)) != null ? _C$Cat : cats[0];
        var owned = app.profile.cats[def.id];
        var level = owned ? owned.level : 0;
        var equipped = app.profile.equipped.includes(def.id);
        var saving = app.catsSaving;
        page.AddChild(titleRegion());
        // The points sign and the bottom controls follow the screen edges on tall screens (the title plaques are baked into
        // the background and stay).
        var _pointsSign = pointsSign(AnchorGroup(page, 'top'), app.profile.points);
        app.refs.catPointsPlate = _pointsSign[0];
        app.refs.catPointsIcon = _pointsSign[1];
        app.refs.catPoints = _pointsSign[2];
        page.AddChild(Text(L('暖阳猫窝'), 24, 20, 90, 124, 36, ink));
        page.AddChild(Text(L('猫咪的暖暖小窝'), 10, 24, 144, 108, 22, ink, 'center', 'body'));
        // Hero cat in the bed; the bed's front rim hides the flat frame bottom.
        var actor = Create(def.id, Math.max(1, level), {
          x: 150,
          y: 357,
          slot: 1,
          context: 'cats',
          scale: 1.0
        });
        if (actor) page.AddChild(actor);
        page.AddChild(Image('ui.cats.bed_front', 58.3, 335.8, 208.3, 49.6));
        // Ability board: content stacked top-down with measured heights; fonts shrink first, then the board grows.
        var BX = 214,
          BW = 144;
        var BY = 104;
        var items = [];
        var showPersonality = def.personality !== undefined;
        var skillLines;
        var shownLines = 0;
        var skillCap;
        var stack = function stack(bh) {
          var _skillCap, _skillCap2, _skillLines;
          var _S$Face = Face('ui.cats.info_board', BX, BY, BW, bh, 0),
            fx = _S$Face[0],
            fy = _S$Face[1],
            fw = _S$Face[2],
            fh = _S$Face[3];
          var cx = fx + 6.5,
            cw = fw - 13;
          var y = fy + 6;
          items = [];
          app.refs.catStatChips = [];
          if (showPersonality) {
            var flavour = phraseLines(L(def.personality), 9, 'body', cw);
            // A bio longer than three lines at 9 pt shrinks to 7.5 before it is cut with an ellipsis (Chinese fits at 9).
            var _S$Block = Block(flavour, 9, cx, y, cw, ink, 'body', 'left', 1.3, 3, 7.5),
              _lbl = _S$Block[0],
              _h = _S$Block[1];
            items.push(_lbl);
            y += _h + 5;
          }
          var icon = SkillIcon(def.id);
          var skillText = SkillText(def.id, Math.max(1, level));
          items.push(Image('ui.cats.skill_medallion', cx, y, 24, 24));
          items.push(Image(icon, cx + 3.5, y + 3.5, 17, 17));
          items.push(Text(L('专属技能'), 10, cx + 29, y, cw - 29, 24, ink, 'left', 'body'));
          y += 27;
          var skillX = fx + 6,
            skillW = fw - 12;
          var skillSize = Math.min(def.id === 'tuantuan' ? 9 : 9.5, (_skillCap = skillCap) != null ? _skillCap : 9.5);
          var floor = (_skillCap2 = skillCap) != null ? _skillCap2 : 9;
          var widest = function widest(size) {
            var w = 0;
            for (var _iterator2 = _createForOfIteratorHelperLoose(skillText.split('\n').join(ZW).split(ZW)), _step2; !(_step2 = _iterator2()).done;) {
              var phrase = _step2.value;
              w = Math.max(w, textWidth(phrase, size, 'body'));
            }
            return w;
          };
          while (skillSize > floor && widest(skillSize) > skillW - .5) skillSize = Math.max(floor, skillSize - .5);
          var first = skillText.split('\n')[0].includes(ZW) ? skillText.split(ZW)[0] : skillText.split('\n')[0];
          var wrapW = skillW;
          if ((def.id === 'ragdoll' || def.id === 'tuantuan') && first) {
            var advance = textWidth(first, skillSize, 'body');
            // Ink width is not measured here; the advance of a complete first clause sets the wrap width.
            // Only a clause that itself fits the 4-unit allowance gets it (a long Japanese sentence would wrap past the box).
            if (def.id === 'tuantuan' || advance > skillW && advance <= skillW + 4) wrapW = Math.max(skillW, Math.min(advance, skillW + 4));
          }
          var _S$Block2 = Block(skillText, skillSize, skillX, y, skillW, ink, 'body', 'left', 1.3, (_skillLines = skillLines) != null ? _skillLines : 6, undefined, wrapW),
            lbl = _S$Block2[0],
            h = _S$Block2[1],
            n = _S$Block2[2];
          items.push(lbl);
          shownLines = n;
          y += h + 4;
          // Current values on the chips; the strip says what the next level brings.
          var lv = Math.max(1, level);
          var now = CatLevel(def.id, lv);
          var stats = [{
            icon: 'icon.cat.stat.charge',
            text: L('需 {0} 能量', now.charge)
          }, {
            icon: 'icon.cat.stat.uses',
            text: def.skill === 'collect' ? L('偏好品 {0} 件', now.power) : SkillValue(def.id, lv)
          }];
          var _loop = function _loop() {
            var st = _stats[_i2];
            var chipH = 26;
            var _S$Face2 = Face('ui.cats.stat_chip', cx - 7, y, cw + 14, chipH, 6),
              available = _S$Face2[2];
            var ts = fitSize(st.text, 10, 'body', available - 11 - 2 - 8);
            // A value that fits one line at 8 pt stays on one line ("エネルギー 50" was split inside the word).
            while (textWidth(st.text, ts, 'body') + 13 > available && ts > 8) ts = Math.max(8, ts - .5);
            if (textWidth(st.text, ts, 'body') + 13 > available) ts = fitSize(st.text, 10, 'body', available - 11 - 2 - 8);
            var lines = textWidth(st.text, ts, 'body') + 13 > available ? wrap(st.text, ts, 'body', available - 13) : [st.text];
            if (lines.length > 1) chipH = lines.length * 14 + 16;
            var plate = Image('ui.cats.stat_chip', cx - 7, y, cw + 14, chipH);
            items.push(plate);
            app.refs.catStatChips.push({
              plate: plate,
              text: st.text,
              lines: lines
            });
            var _S$Face3 = Face('ui.cats.stat_chip', cx - 7, y, cw + 14, chipH, 6),
              ix = _S$Face3[0],
              iy = _S$Face3[1],
              iw = _S$Face3[2],
              ih = _S$Face3[3];
            if (lines.length === 1) {
              items.push(centreOnPlate(Row(ix, iy, iw, ih, [{
                icon: st.icon,
                size: 11
              }, {
                text: st.text,
                size: ts,
                family: 'body'
              }], 2), y, chipH, 'ui.cats.stat_chip', ih));
            } else {
              var group = UI.Panel({
                position: 'absolute',
                left: ix,
                top: iy,
                width: iw,
                height: lines.length * 14 - 2,
                pointerEvents: 'none'
              });
              lines.forEach(function (line, index) {
                var entries = [{
                  text: line,
                  size: ts,
                  family: 'body'
                }];
                if (index === 0) entries.unshift({
                  icon: st.icon,
                  size: 11
                });
                group.AddChild(Row(0, index * 14, iw, 12, entries, 2));
              });
              items.push(centreOnPlate(group, y, chipH, 'ui.cats.stat_chip', lines.length * 14 - 2));
            }
            y += chipH + 3;
          };
          for (var _i2 = 0, _stats = stats; _i2 < _stats.length; _i2++) {
            _loop();
          }
          var nextText;
          if (!owned) nextText = L('领养后可升级');else if (level >= 5) nextText = L('亲密已满级');else {
            var nxt = CatLevel(def.id, level + 1);
            nextText = nxt.charge < now.charge ? L('需 {0} 能量', nxt.charge) : SkillValue(def.id, level + 1);
          }
          var sw = cw + 8,
            bonusX = cx - 4;
          var _S$Face4 = Face('ui.cats.bonus_strip', cx - 4, y, sw, 24, 6),
            rwOne = _S$Face4[2];
          var upgrading = !!owned && level < 5;
          var preferredValue = upgrading && def.id === 'tuantuan' && textWidth(nextText, 9, 'body') > rwOne;
          if (preferredValue) {
            sw += 4;
            bonusX -= 2;
            rwOne = Face('ui.cats.bonus_strip', bonusX, y, sw, 24, 6)[2];
          }
          var upLabel = L('升级后');
          var oneW = upgrading ? textWidth(upLabel, 10, 'body') + 2 + textWidth(nextText, 10, 'body') : 12 + 2 + textWidth(nextText, 10, 'body');
          var two = upgrading && oneW > rwOne * .9;
          var iconFits = oneW <= rwOne * .9;
          var sh = two ? preferredValue ? 50 : 46 : 24;
          var valueSize = two ? fitSize(nextText, 10, 'body', rwOne) : 10;
          var valueLines = two ? textWidth(nextText, valueSize, 'body') <= rwOne ? [nextText] : wrap(nextText, valueSize, 'body', rwOne * .95) : [];
          if (valueLines.length > 1) {
            var _resolveAsset$safeAre, _resolveAsset;
            var safe = (_resolveAsset$safeAre = (_resolveAsset = resolveAsset('ui.cats.bonus_strip')) == null ? void 0 : _resolveAsset.safeArea) != null ? _resolveAsset$safeAre : [0, 0, 0, 0];
            sh = Math.ceil(((valueLines.length + 1) * 14 - 2 + 12) / (1 - safe[1] - safe[3]));
          }
          items.push(Image('ui.cats.bonus_strip', bonusX, y, sw, sh));
          var _S$Face5 = Face('ui.cats.bonus_strip', bonusX, y, sw, sh, 6),
            rx = _S$Face5[0],
            ry = _S$Face5[1],
            rw = _S$Face5[2],
            rh = _S$Face5[3];
          var green = [74, 140, 62, 255];
          if (two && upgrading) {
            var gh = (valueLines.length + 1) * 14 - 2;
            var group = UI.Panel({
              position: 'absolute',
              left: rx,
              top: ry,
              width: rw,
              height: gh,
              pointerEvents: 'none'
            });
            group.AddChild(Text(upLabel, 9, 0, 0, rw, 12, muted, 'center', 'body'));
            valueLines.forEach(function (line, index) {
              return group.AddChild(Text(line, valueSize, preferredValue ? .5 : 0, (index + 1) * 14, rw, 12, green, 'center', 'body'));
            });
            items.push(centreOnPlate(group, y, sh, 'ui.cats.bonus_strip', gh));
          } else if (!upgrading && !iconFits) {
            items.push(centreOnPlate(Text(nextText, fitSize(nextText, 10, 'body', rw), rx, ry, rw, rh, ink, 'center', 'body'), y, sh, 'ui.cats.bonus_strip', rh));
          } else {
            var row = upgrading ? [{
              text: upLabel,
              size: 10,
              family: 'body'
            }, {
              text: nextText,
              size: 10,
              family: 'body',
              color: green
            }] : [{
              icon: 'icon.cat.stat.intimacy_bonus',
              size: 12
            }, {
              text: nextText,
              size: 10,
              family: 'body'
            }];
            items.push(centreOnPlate(Row(rx, ry, rw, rh, row, 2), y, sh, 'ui.cats.bonus_strip', rh));
          }
          y += sh;
          return y + 6 - (fy + fh);
        };
        // Fitted to its content: from 221, grow down to the bench (y382), then upwards; then shrink the skill copy to 7 pt;
        // only then cut lines with an ellipsis.
        var TOP_MIN = 20;
        var sa = (_resolveAsset$safeAre2 = (_resolveAsset2 = resolveAsset('ui.cats.info_board')) == null ? void 0 : _resolveAsset2.safeArea) != null ? _resolveAsset$safeAre2 : [0, 0, 0, 0];
        var faceK = 1 - sa[1] - sa[3];
        var maxH = 382 - TOP_MIN;
        var bh = 221;
        var over = stack(bh);
        var resize = function resize(h) {
          bh = h;
          BY = Math.min(104, 382 - bh);
          over = stack(bh);
        };
        for (var i = 0; i < 4; i++) {
          if (over <= 0 || bh >= maxH) break;
          resize(Math.min(maxH, bh + over / faceK + .5));
        }
        while (over > 0 && ((_skillCap3 = skillCap) != null ? _skillCap3 : 9) > 7) {
          var _skillCap3, _skillCap4;
          skillCap = ((_skillCap4 = skillCap) != null ? _skillCap4 : 9) - .5;
          over = stack(bh);
        }
        if (over > 0) {
          skillLines = shownLines;
          while (over > 0 && skillLines > 2) {
            skillLines--;
            over = stack(bh);
          }
        }
        if (over < -1 && bh > 221) resize(Math.max(221, bh + over / faceK + .5));
        page.AddChild(Image('ui.cats.info_board', BX, BY, BW, bh));
        page.AddChild(Image('ui.cats.name_tag', BX + 18, BY + 22, 74, 25));
        {
          var _S$Face6 = Face('ui.cats.name_tag', BX + 18, BY + 22, 74, 25, 7),
            _fx = _S$Face6[0],
            _fy = _S$Face6[1],
            _fw = _S$Face6[2],
            _fh = _S$Face6[3];
          var _S$fitText = fitText(L(def.name), 16, 'sans', _fw - 1),
            size = _S$fitText[0],
            family = _S$fitText[1];
          var name = Text(L(def.name), size, _fx, _fy, _fw, _fh, ink, 'center', family);
          name.SetStyle({
            translateY: -.5
          });
          page.AddChild(name);
        }
        for (var _i3 = 0, _items = items; _i3 < _items.length; _i3++) {
          var it = _items[_i3];
          page.AddChild(it);
        }
        app.refs.catBoardFit = {
          height: bh,
          spare: -over,
          personality: showPersonality,
          skillLines: skillLines,
          skillCap: skillCap
        };
        // Selector cards on the bench (5 x 62, gap 6); selectable cats first, locked previews after.
        var ordered = [].concat(cats.filter(function (c) {
          return selectable(c.id);
        }), cats.filter(function (c) {
          return !selectable(c.id);
        }));
        app.refs.catCards = {};
        ordered.forEach(function (cat, i) {
          var id = cat.id,
            x = 13 + i * 68;
          if (selectable(id)) {
            var sel = id === def.id;
            var lift = sel ? -3 : 0;
            if (sel) {
              page.AddChild(Image('ui.cats.selector.glow', x - 5, 385 + lift, 72, 72));
              page.AddChild(Image('ui.cats.selector.glow', x - 3, 387 + lift, 68, 68));
            }
            var _S$ImageButton = ImageButton('ui.cats.selector.card', x, 390 + lift, 62, 65, function () {
                app.selectedCat = id;
                Cats(app);
              }, {
                pressScale: .96,
                hitPad: 0
              }),
              root = _S$ImageButton[0],
              button = _S$ImageButton[1],
              face = _S$ImageButton[2];
            if (resolveAsset('cat.' + id + '.selector')) face.AddChild(Image('cat.' + id + '.selector', 4, 6, 54, 54));
            page.AddChild(root);
            app.refs.catCards[id] = button;
            page.AddChild(Image('ui.cats.selector.nameplate', x + 2, 443, 58, 19));
            page.AddChild(FaceText('ui.cats.selector.nameplate', x + 2, 443, 58, 19, L(cat.name), sel ? 12 : 11, sel ? ink : [118, 86, 60, 255], 'center', 'sans', 4));
            var onDuty = app.profile.equipped.includes(id);
            var adopted = app.profile.cats[id] !== undefined;
            var tagId = onDuty ? 'ui.cats.selector.tag.on' : adopted ? 'ui.cats.selector.tag.ready' : 'ui.cats.selector.tag.new';
            var tagText = onDuty ? L('上场中') : adopted ? L('待命中') : L('未领养');
            var tagColor = adopted && !onDuty ? [98, 70, 48, 255] : cream;
            page.AddChild(Image(tagId, x, 464, 62, 16));
            var _S$Face7 = Face(tagId, x, 464, 62, 16, 0),
              _fx2 = _S$Face7[0],
              _fy2 = _S$Face7[1],
              _fw2 = _S$Face7[2],
              _fh2 = _S$Face7[3];
            var maxW = (_fw2 - 10) * .95;
            var shown = tagText;
            // Longer languages (German "Im Dienst", Russian "На смене") shrink to 7.5 pt before anything is cut;
            // Chinese and English fit at 9 and are unchanged.
            var tagSize = 9;
            while (tagSize > 7.5 && textWidth(shown, tagSize, 'body') > maxW) tagSize -= .5;
            if (textWidth(shown, tagSize, 'body') > maxW) {
              var ch = Array.from(shown);
              while (ch.length > 1 && textWidth(ch.join('') + '…', tagSize, 'body') > maxW) ch.pop();
              shown = ch.join('') + '…';
            }
            // Middle alignment centres the line box, not the ink: lift Latin by 4/3 and CJK by 1/3.
            // Explicit ranges (kana, CJK, Hangul): the native V8 has no Unicode property escapes (\p{...}).
            var lift2 = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(shown) ? 1 / 3 : 4 / 3;
            page.AddChild(Text(shown, tagSize, _fx2 + 5, _fy2 - lift2, _fw2 - 10, _fh2, tagColor, 'center', 'body'));
          } else {
            page.AddChild(Image('ui.cats.selector.locked', x, 390, 62, 65));
            page.AddChild(Image('ui.cats.selector.nameplate', x + 2, 443, 58, 19));
            var _S$Face8 = Face('ui.cats.selector.nameplate', x + 2, 443, 58, 19, 4),
              _fx3 = _S$Face8[0],
              _fy3 = _S$Face8[1],
              _fw3 = _S$Face8[2],
              _fh3 = _S$Face8[3];
            page.AddChild(Row(_fx3, _fy3, _fw3, _fh3, [{
              icon: 'ui.cats.lock_badge',
              size: 9
            }, {
              text: L(cat.name),
              size: 11,
              color: [98, 70, 48, 255]
            }], 1));
            page.AddChild(Image('ui.cats.selector.soon_plate', x - 2, 464, 66, 17));
            page.AddChild(FaceText('ui.cats.selector.soon_plate', x - 2, 464, 66, 17, L('待开放'), 9, cream, 'center', 'body', 3));
          }
        });
        // Status group centred on the paper face; an old dotted divider at source x429 is covered with blank paper.
        var SY = 482,
          SH = 50;
        page.AddChild(Image('ui.cats.status_bar', 10, SY, 340, SH));
        var paperX = 421,
          paperY = 12,
          paperW = 16,
          paperH = 112,
          imageW = 1020,
          imageH = 136;
        var scaleX = 340 / imageW,
          scaleY = SH / imageH;
        var dividerCover = UI.Panel({
          position: 'absolute',
          left: 10 + paperX * scaleX,
          top: SY + paperY * scaleY,
          width: paperW * scaleX,
          height: paperH * scaleY,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        dividerCover.AddChild(Image('ui.cats.status_bar', -(paperX + 30) * scaleX, -paperY * scaleY, 340, SH));
        page.AddChild(dividerCover);
        var _S$Face9 = Face('ui.cats.status_bar', 10, SY, 340, SH, 0),
          fx = _S$Face9[0],
          fy = _S$Face9[1],
          fw = _S$Face9[2],
          fh = _S$Face9[3];
        var half = fh / 2;
        var changed = function changed(ok, err) {
          app.catsSaving = undefined;
          if (app.screen === 'cats') {
            Cats(app);
            if (ok) Play(def.id, 'cheer', 'cats');else app.Toast(String(err));
          }
        };
        var run = function run(fn) {
          if (app.catsSaving) return;
          app.catsSaving = true;
          Cats(app);
          var _fn = fn(),
            ok = _fn[0],
            err = _fn[1];
          changed(ok, err);
        };
        var upgradeBtn;
        var bw = 80;
        var t1,
          t2,
          size1,
          size2 = 10;
        if (!owned) {
          t1 = L('解锁价格');
          t2 = formatNumber(def.cost);
          size1 = 10;
          size2 = 17;
        } else if (level < 5) {
          t1 = L('亲密 Lv{0}→{1}', level, level + 1);
          t2 = L('费用 {0}', formatNumber(CatLevelCost(def.id, level)));
          size1 = 10;
        } else {
          t1 = L('亲密已满级 Lv5');
          size1 = 12;
        }
        var tw = Math.max(textWidth(t1, size1, 'body'), t2 ? textWidth(t2, size2, 'body') : 0) + 2;
        var groupW = 22 + 4 + tw + (t2 ? 12 + bw : 0);
        var gx = fx + (fw - groupW) / 2,
          tx = gx + 26,
          bx = tx + tw + 12;
        page.AddChild(Image(owned ? 'ui.icon.intimacy_heart' : 'ui.icon.points_matatabi', gx, fy + (fh - 22) / 2, 22, 22));
        page.AddChild(Text(t1, size1, tx, t2 ? fy + 3 : fy, tw, t2 ? half - 3 : fh, ink, 'left', 'body'));
        if (t2) page.AddChild(Text(t2, size2, tx, fy + half, tw, half - 3, owned ? muted : ink, 'left', 'body'));
        if (!owned) {
          var enough = app.profile.points >= def.cost;
          var pill = enough ? 'ui.cats.pill.ok' : 'ui.cats.pill.warn';
          page.AddChild(Image(pill, bx, fy + (fh - 30) / 2, bw, 30));
          var txt = enough ? L('可以解锁') : L('积分不足');
          var _S$Face10 = Face(pill, bx, fy + (fh - 30) / 2, bw, 30, 8),
            px = _S$Face10[0],
            py = _S$Face10[1],
            pw = _S$Face10[2],
            ph = _S$Face10[3];
          var _S$fitText2 = fitText(txt, 12, 'sans', pw - 1),
            _size = _S$fitText2[0],
            _family = _S$fitText2[1];
          page.AddChild(Text(txt, _size, px, py, pw, ph, cream, 'center', _family));
        } else if (level < 5) {
          var cost = CatLevelCost(def.id, level);
          var _S$ImageButton2 = ImageButton('ui.cats.button.upgrade', bx, fy + (fh - 32) / 2, bw, 32, function () {
              return run(function () {
                return app.profile.LevelUp(def.id);
              });
            }, {
              pressScale: .95,
              hitPad: 6,
              disabled: saving || app.profile.points < cost
            }),
            root = _S$ImageButton2[0],
            btn = _S$ImageButton2[1],
            face = _S$ImageButton2[2];
          face.AddChild(FaceText('ui.cats.button.upgrade', 0, 0, bw, 32, L('升级'), 15, ink, 'center', 'sans', 8));
          page.AddChild(root);
          upgradeBtn = btn;
        }
        // Main action slab.
        var label, enabled, action;
        if (saving) {
          label = L('保存中…');
          enabled = false;
        } else if (!owned) {
          label = L('解锁{0}', L(def.name));
          enabled = app.profile.points >= def.cost;
          action = function action() {
            return run(function () {
              return app.profile.BuyCat(def.id);
            });
          };
        } else if (!equipped) {
          if (!IsReleasedCat(def.id)) {
            label = L('后续开放');
            enabled = false;
          } else if (app.profile.equipped.length >= 2) {
            label = L('位置已满');
            enabled = false;
          } else {
            label = L('上场');
            enabled = true;
            action = function action() {
              return run(function () {
                return app.profile.Equip(def.id);
              });
            };
          }
        } else if (app.profile.equipped.length === 1) {
          label = L('唯一伙伴');
          enabled = false;
        } else {
          label = L('取消上场');
          enabled = true;
          action = function action() {
            return run(function () {
              return app.profile.Equip(def.id);
            });
          };
        }
        var _S$ImageButton3 = ImageButton(enabled ? 'ui.cats.button.main.enabled' : 'ui.cats.button.main.disabled', 90, 550, 180, 39, function () {
            return action == null ? void 0 : action();
          }, {
            pressScale: .96,
            hitPad: 4
          }),
          mainRoot = _S$ImageButton3[0],
          mainBtn = _S$ImageButton3[1],
          mainFace = _S$ImageButton3[2];
        if (!enabled) mainBtn.SetDisabled(true);
        var _S$fitText3 = fitText(label, Array.from(label).length > 9 ? 17 : 20, 'sans', 100),
          mainSize = _S$fitText3[0],
          mainFamily = _S$fitText3[1];
        mainFace.AddChild(Text(label, mainSize, 40, 4, 100, 30, enabled ? cream : [96, 92, 88, 255], undefined, mainFamily));
        var controls = AnchorGroup(page, 'bottom');
        controls.AddChild(mainRoot);
        app.refs.petActions = [mainBtn, upgradeBtn];
        var _S$ImageButton4 = ImageButton('ui.common.round_plate', 12, 548, 44, 44, app.Home, {
            pressScale: .94,
            hitPad: 2
          }),
          backRoot = _S$ImageButton4[0],
          backFace = _S$ImageButton4[2];
        backFace.AddChild(Image('ui.icon.back.r02', 11, 11, 22, 22));
        controls.AddChild(backRoot);
        controls.AddChild(Text(L('返回'), 11, 12, 593, 44, 14, ink));
        // Save failure message on the status bar art (with the same divider covered).
        var message = UI.Panel({
          position: 'absolute',
          left: 60,
          top: 596,
          width: 290,
          height: 40,
          opacity: 0,
          pointerEvents: 'none'
        });
        message.AddChild(Image('ui.cats.status_bar', 0, 0, 290, 40));
        var cover = UI.Panel({
          position: 'absolute',
          left: paperX * 290 / imageW,
          top: paperY * 40 / imageH,
          width: paperW * 290 / imageW,
          height: paperH * 40 / imageH,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        cover.AddChild(Image('ui.cats.status_bar', -(paperX + 30) * 290 / imageW, -paperY * 40 / imageH, 290, 40));
        message.AddChild(cover);
        var text = UI.Label({
          minFontSize: 9,
          position: 'absolute',
          left: 0,
          top: 0,
          width: 290,
          height: 40,
          text: '',
          fontSize: 13,
          fontColor: ink,
          textAlign: 'center',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          fontFamily: 'body',
          pointerEvents: 'none'
        });
        message.AddChild(text);
        message.SetText = function (t) {
          return text.SetText(t);
        };
        app.refs.message = message;
        controls.AddChild(message);
        app.MountPage(page);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/catView.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './assets.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, Node, UITransform, Sprite, resources, JsonAsset, SpriteAtlas, UI, resolveAsset;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
      resources = module.resources;
      JsonAsset = module.JsonAsset;
      SpriteAtlas = module.SpriteAtlas;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }],
    execute: function () {
      exports({
        Clear: Clear,
        Create: Create,
        DetachResult: DetachResult,
        Play: Play,
        Release: Release,
        Update: Update
      });
      cclegacy._RF.push({}, "11179coJPBBZ4UeyOzOL+qs", "catView", undefined);
      var priority = {
        cheer: 1,
        celebrate: 2,
        assist: 3
      };
      // Slot the source art faces (tail side): tail left = slot 1.
      var nativeSlot = {
        tuantuan: 1,
        zhima: 2,
        huajuan: 1,
        ragdoll: 1,
        tuxedo: 1
      };
      var RELEASE = exports('RELEASE', {
        ragdoll: 10 / 12,
        tuxedo: 11 / 12,
        huajuan: 12 / 12,
        zhima: 13 / 12,
        tuantuan: 14 / 12
      });
      function Release(id) {
        var _RELEASE$id;
        return (_RELEASE$id = RELEASE[id]) != null ? _RELEASE$id : 0;
      }
      var views = {};
      var clock = 0;
      var clipCache = new Map();
      function clipId(id, clip) {
        if (!nativeSlot[id]) return null;
        var cid = "cat." + id + "." + clip;
        var item = resolveAsset(cid);
        return item && item.path.startsWith('animations/') ? cid : null;
      }
      function loadClip(cid) {
        var hit = clipCache.get(cid);
        if (hit) return hit;
        var p = new Promise(function (ok, fail) {
          resources.load("animations/" + cid + "/clip", JsonAsset, function (err, json) {
            if (err) {
              fail(err);
              return;
            }
            var clip = json.json;
            var pages = [];
            var _loop = function _loop(_p) {
              pages.push(new Promise(function (res, rej) {
                return resources.load("animations/" + cid + "/page-" + String(_p).padStart(2, '0'), SpriteAtlas, function (e, atlas) {
                  return e ? rej(e) : res(atlas);
                });
              }));
            };
            for (var _p = 1; _p <= clip.pages; _p++) {
              _loop(_p);
            }
            Promise.all(pages).then(function (atlases) {
              var frames = clip.frames.map(function (name) {
                for (var _iterator = _createForOfIteratorHelperLoose(atlases), _step; !(_step = _iterator()).done;) {
                  var _a$getSpriteFrame;
                  var a = _step.value;
                  var f = (_a$getSpriteFrame = a.getSpriteFrame(name)) != null ? _a$getSpriteFrame : a.getSpriteFrame(name + '.png');
                  if (f) return f;
                }
                throw new Error("frame " + name + " missing in " + cid);
              });
              ok({
                clip: clip,
                frames: frames
              });
            }, fail);
          });
        });
        clipCache.set(cid, p);
        return p;
      }
      function start(view, clip) {
        var cid = clipId(view.id, clip);
        if (!cid) return false;
        var token = ++view.token;
        view.current = clip;
        view.exitReady = false;
        view.loop = clip === 'idle';
        loadClip(cid).then(function (_ref) {
          var _view$sprite;
          var c = _ref.clip,
            frames = _ref.frames;
          if (view.token !== token || !((_view$sprite = view.sprite) != null && _view$sprite.isValid)) return;
          view.clip = c;
          view.frames = frames;
          view.frameIndex = 0;
          view.frameTime = 0;
          view.sprite.spriteFrame = frames[0];
        }, function (e) {
          return console.warn('[CatView] clip failed', cid, e);
        });
        return true;
      }

      // The result page is rebuilt (ad states, details): its celebrating cats keep playing across rebuilds.
      var viewContext;
      var runToken;
      function DetachResult(run) {
        if (viewContext !== 'ending' || runToken !== run) return false;
        for (var _i = 0, _Object$keys = Object.keys(views); _i < _Object$keys.length; _i++) {
          var _c$parent;
          var k = _Object$keys[_i];
          var c = views[k].container;
          (_c$parent = c.parent) == null || _c$parent.RemoveChild(c);
        }
        return true;
      }
      function Clear() {
        for (var _i2 = 0, _Object$keys2 = Object.keys(views); _i2 < _Object$keys2.length; _i2++) {
          var k = _Object$keys2[_i2];
          views[k].container.Destroy();
          delete views[k];
        }
      }
      function Create(id, level, options) {
        var _options$scale;
        if (!clipId(id, 'idle')) return null;
        var s = (_options$scale = options.scale) != null ? _options$scale : 1;
        var style = {
          position: 'absolute',
          left: options.x - 96,
          top: options.y - 96 - 48 * s,
          width: 192,
          height: 192,
          overflow: 'visible',
          pointerEvents: 'none',
          scale: s
        };
        var existing = views[id];
        if (existing) {
          existing.container.SetStyle(style);
          return existing.container;
        }
        var container = UI.Panel(style);
        // The sprite draws the frame untrimmed inside the full source canvas, scaled to the 192 box.
        var n = new Node('cat');
        n.layer = container.node.layer;
        var t = n.addComponent(UITransform);
        t.setAnchorPoint(0, 1);
        t.setContentSize(192, 192);
        var flipX = options.slot !== nativeSlot[id];
        if (flipX) {
          n.setScale(-1, 1, 1);
          n.setPosition(192, 0, 0);
        }
        var sprite = n.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        sprite.trim = false;
        container.node.addChild(n);
        var view = {
          id: id,
          level: level,
          context: options.context,
          container: container,
          flipX: flipX,
          dual: options.dual === true,
          current: 'idle',
          exitReady: false,
          sprite: sprite,
          frameIndex: 0,
          frameTime: 0,
          loop: true,
          token: 0
        };
        views[id] = view;
        viewContext = options.context;
        runToken = options.runToken;
        start(view, options.context === 'ending' ? 'celebrate' : 'idle');
        return container;
      }
      function Play(id, clipIn, context, delay) {
        var view = views[id];
        if (!view || !priority[clipIn]) return false;
        var clip = clipIn;
        if (clip === 'celebrate' && context !== 'ending' && view.level < 3) clip = 'cheer';
        if (!clipId(id, clip)) return false;
        if (clip === 'assist') {
          if (delay && delay > 0) view.assistAt = clock + delay;else {
            view.assistAt = undefined;
            view.pending = undefined;
            start(view, 'assist');
          }
          return true;
        }
        if (!view.pending || priority[clip] >= priority[view.pending]) view.pending = clip;
        return true;
      }
      function Update(dt) {
        clock += dt;
        for (var _i3 = 0, _Object$values = Object.values(views); _i3 < _Object$values.length; _i3++) {
          var _view$sprite2;
          var view = _Object$values[_i3];
          if (view.assistAt !== undefined && clock >= view.assistAt) {
            view.assistAt = undefined;
            view.pending = undefined;
            start(view, 'assist');
          }
          // Frame stepping (urhox Sprite: each frame shows for its own duration).
          if (view.clip && view.frames && (_view$sprite2 = view.sprite) != null && _view$sprite2.isValid) {
            var _view$clip$durationsM;
            view.frameTime += dt * 1000;
            var d = (_view$clip$durationsM = view.clip.durationsMs[view.frameIndex]) != null ? _view$clip$durationsM : 83.33;
            while (view.frameTime >= d) {
              var _view$clip$durationsM2;
              view.frameTime -= d;
              view.frameIndex++;
              if (view.frameIndex >= view.frames.length) {
                view.exitReady = true;
                view.frameIndex = view.loop ? 0 : view.frames.length - 1;
                if (!view.loop) {
                  view.frameTime = 0;
                  break;
                }
              }
              d = (_view$clip$durationsM2 = view.clip.durationsMs[view.frameIndex]) != null ? _view$clip$durationsM2 : 83.33;
            }
            view.sprite.spriteFrame = view.frames[view.frameIndex];
          }
        }
        for (var _i4 = 0, _Object$values2 = Object.values(views); _i4 < _Object$values2.length; _i4++) {
          var _view = _Object$values2[_i4];
          if (_view.exitReady) {
            var _view$pending;
            _view.exitReady = false;
            var next = (_view$pending = _view.pending) != null ? _view$pending : _view.current !== 'idle' ? 'idle' : undefined;
            _view.pending = undefined;
            if (next) start(_view, next);
          }
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/config.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './i18n.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, L, localDecimal;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      L = module.L;
      localDecimal = module.localDecimal;
    }],
    execute: function () {
      exports({
        Cat: Cat,
        CatLevel: CatLevel,
        CatLevelCost: CatLevelCost,
        IsReleased: IsReleased,
        IsReleasedCat: IsReleasedCat,
        ItemText: ItemText,
        Points: Points,
        ReleasePool: ReleasePool,
        SkillIcon: SkillIcon,
        SkillText: SkillText,
        SkillValue: SkillValue,
        Upgrade: Upgrade,
        UpgradeSlotCap: UpgradeSlotCap
      });
      cclegacy._RF.push({}, "e925045W3VAeryhO88m3OIa", "config", undefined);
      var SIZE = exports('SIZE', 7),
        INITIAL_TIME = exports('INITIAL_TIME', 70),
        MAX_TIME = exports('MAX_TIME', 90),
        ORDER_TIME = exports('ORDER_TIME', 9);
      var SESSION_LIMIT = exports('SESSION_LIMIT', 180),
        RECOVERY_FADE_START = exports('RECOVERY_FADE_START', 60),
        RECOVERY_FADE_END = exports('RECOVERY_FADE_END', 150);
      var SWAP_TIME = exports('SWAP_TIME', 0.3),
        SWAP_TIME_CAP = exports('SWAP_TIME_CAP', 4),
        SCORE_PER_GOOD = exports('SCORE_PER_GOOD', 10);
      var ADS_ENABLED = exports('ADS_ENABLED', true),
        AD_DAILY_CAP = exports('AD_DAILY_CAP', 3),
        AD_BONUS_STEPS = exports('AD_BONUS_STEPS', [2, 1, .5]),
        AD_BONUS_FLOOR = exports('AD_BONUS_FLOOR', 100);
      var SCORE_PER_POINT = exports('SCORE_PER_POINT', 100),
        POINT_CAP = exports('POINT_CAP', 200),
        POINT_KNEE = exports('POINT_KNEE', 15000),
        RULE_VERSION = exports('RULE_VERSION', 'm1.8'),
        DAILY_BONUS = exports('DAILY_BONUS', 300),
        SPOOL_GOODS = exports('SPOOL_GOODS', 16);
      var ORDER_BASE = exports('ORDER_BASE', 180),
        ORDER_GROWTH = exports('ORDER_GROWTH', 70),
        ORDER_ACCELERATION = exports('ORDER_ACCELERATION', 10);
      var SWAP_DURATION = exports('SWAP_DURATION', 0.16),
        CLEAR_DURATION = exports('CLEAR_DURATION', 0.48),
        FALL_DURATION = exports('FALL_DURATION', 0.38);
      var PRESENTATION = exports('PRESENTATION', {
        delivery: 0.62,
        fill: 0.26,
        hold: 1.35,
        depart: 0.30,
        arrive: 0.30,
        screen: 0.35,
        score: 1.0,
        settle: 0.6
      });
      var SCORE_REWARD_DAILY_CAP = exports('SCORE_REWARD_DAILY_CAP', 10);
      var INITIAL_POINTS = exports('INITIAL_POINTS', 200);
      var levelCosts = exports('levelCosts', [450, 900, 1800, 3150]);
      var goods = exports('goods', [{
        id: 'fish',
        name: '鱼干',
        symbol: '鱼',
        color: [245, 163, 89]
      }, {
        id: 'yarn',
        name: '毛线球',
        symbol: '线',
        color: [234, 137, 172]
      }, {
        id: 'bell',
        name: '铃铛',
        symbol: '铃',
        color: [240, 202, 92]
      }, {
        id: 'feather',
        name: '羽毛',
        symbol: '羽',
        color: [174, 150, 222]
      }, {
        id: 'cushion',
        name: '靠垫',
        symbol: '垫',
        color: [116, 182, 215]
      }]);
      var ZW = '​';
      var cats = exports('cats', [{
        id: 'tuantuan',
        name: '团团',
        cost: 0,
        levelCosts: [350, 700, 1450, 2700],
        charge: 56,
        levelCharges: [56, 50, 50, 45, 45],
        levelPowers: [3, 3, 4, 4, 5],
        skill: 'collect',
        description: "\u628A {n} \u4EF6\u5546\u54C1" + ZW + "\u53D8\u6210\u504F\u597D\u54C1\u3002",
        personality: "\u6D3B\u6CFC\u53C8\u8D34\u5FC3\uFF0C" + ZW + "\u603B\u80FD\u5E26\u6765" + ZW + "\u6EE1\u6EE1\u7684\u5FEB\u4E50\uFF01"
      }, {
        id: 'zhima',
        name: '芝麻',
        cost: 500,
        levelCosts: [450, 900, 1800, 3200],
        charge: 99,
        levelCharges: [99, 90, 87, 84, 80],
        levelPowers: [2, 2, 2, 3, 3],
        skill: 'bomb',
        description: "\u5728\u68CB\u76D8\u4E0A" + ZW + "\u653E {n} \u679A\u70B8\u5F39\u3002",
        personality: "\u8BDD\u4E0D\u591A\uFF0C" + ZW + "\u5374\u603B\u80FD\u7ED9\u4EBA\u60CA\u559C\uFF01"
      }, {
        id: 'huajuan',
        name: '花卷',
        cost: 1000,
        levelCosts: [550, 1050, 2100, 3750],
        charge: 70,
        levelCharges: [70, 66, 64, 62, 62],
        levelPowers: [3, 3, 3, 3, 4],
        skill: 'line',
        description: "\u5728\u68CB\u76D8\u4E0A" + ZW + "\u653E {n} \u4E2A\u7EBF\u6D88\u3002",
        personality: "\u597D\u5947\u5FC3\u6EE1\u6EE1\uFF0C" + ZW + "\u4EC0\u4E48\u90FD\u60F3\u6478\u4E00\u6478\uFF01"
      }, {
        id: 'ragdoll',
        name: '奶茶',
        cost: 2000,
        levelCosts: [650, 1300, 2550, 4500],
        charge: 50,
        levelCharges: [50, 45, 43, 40, 40],
        levelPowers: [80, 80, 80, 80, 90],
        skill: 'cuddle',
        universalPartner: true,
        description: "\u7ED9\u642D\u6863\u6512 {n}% \u7684\u80FD\u91CF\uFF1B" + ZW + "\u6CA1\u6709\u642D\u6863\u65F6\uFF0C" + ZW + "\u52A0 {s} \u79D2\u8425\u4E1A\u65F6\u95F4\u3002",
        personality: "\u6E29\u67D4\u53C8\u9ECF\u4EBA\uFF0C" + ZW + "\u6700\u7231\u8D34\u8D34\uFF01"
      }, {
        id: 'tuxedo',
        name: '汤圆',
        cost: 2000,
        levelCosts: [650, 1300, 2550, 4500],
        charge: 100,
        levelCharges: [100, 90, 85, 80, 64],
        levelPowers: [3, 3, 3, 4, 5],
        skill: 'detonate',
        universalPartner: true,
        description: "\u5F15\u7206\u573A\u4E0A\u6700\u591A {n} \u679A\u70B8\u5F39\uFF1B" + ZW + "\u573A\u4E0A\u6CA1\u6709\u70B8\u5F39\u65F6\uFF0C" + ZW + "\u5C31\u653E 2 \u679A\uFF0C" + ZW + "\u7B49\u4E0B\u6B21\u51FA\u624B\u518D\u5F15\u7206\u3002",
        personality: "\u95F9\u817E\u53C8\u5F00\u5FC3\uFF0C" + ZW + "\u4E00\u523B\u505C\u4E0D\u4E0B\u6765\uFF01"
      }]);
      // Retired (2026-09-27): kept only so old saves that own them still load; never shown, adopted or equipped.
      var retiredCats = exports('retiredCats', [{
        id: 'naigai',
        name: '奶盖',
        cost: 900,
        charge: 75,
        skill: 'time',
        description: '恢复 {n} 秒时间'
      }, {
        id: 'moka',
        name: '摩卡',
        cost: 2200,
        charge: 70,
        skill: 'score',
        description: "\u83B7\u5F97 {n} \u5206" + ZW + "\u5E76\u63A8\u8FDB\u8BA2\u5355"
      }]);
      var upgrades = exports('upgrades', [{
        id: 'ribbon_spool',
        name: '缎带线轴',
        description: '每消除 {spoolEvery} 件商品，就送你 1 个线消；交换时直接连出四件一排，还会再多送 1 个。',
        route: 'ribbon',
        tags: ['line']
      }, {
        id: 'ribbon_cross',
        name: '十字剪刀',
        description: '线消发动时，会同时清掉它所在的一整行和一整列。',
        route: 'ribbon',
        tags: ['line']
      }, {
        id: 'ribbon_relay',
        name: '接力缎带',
        description: '每引爆 {relayEvery} 个线消，就送你 {relayGive} 个线消。',
        route: 'ribbon',
        tags: ['line']
      }, {
        id: 'ribbon_tip',
        name: '漂亮封边',
        description: '被线消清掉的商品，得分多 {tip%}%。',
        route: 'ribbon',
        tags: ['line']
      }, {
        id: 'ribbon_finale',
        name: '绵延彩带',
        description: '同一次交换里接连引爆线消时，第 2 个得分多 {finaleStep%}%，之后每个再多 {finaleStep%}%，最多多 {finaleMax%}%。',
        route: 'ribbon',
        tags: ['line']
      }, {
        id: 'ribbon_bow',
        name: '蝴蝶结',
        description: '每交一单，就送你 {bowCount} 个线消，一个清行，一个清列。',
        route: 'ribbon',
        tags: ['line', 'order']
      }, {
        id: 'ribbon_wide',
        name: '宽幅缎带',
        description: '线消发动时，一次清掉两行或两列。',
        route: 'ribbon',
        tags: ['line']
      }, {
        id: 'ribbon_measure',
        name: '缎带量尺',
        description: '炸弹和线消合在一起算，每引爆 {ribbonEvery} 个，就再得 {counterScore} 分，算进当前订单。',
        route: 'ribbon',
        tags: ['line', 'bomb']
      }, {
        id: 'bake_foam',
        name: '发泡糖',
        description: '每有 {foamEvery} 次交换成功消除，补货时就送你 1 枚炸弹。',
        route: 'bake',
        tags: ['bomb']
      }, {
        id: 'bake_tray',
        name: '大号烤盘',
        description: '炸弹的爆炸范围从 3×3 变成 5×5。',
        route: 'bake',
        tags: ['bomb']
      }, {
        id: 'bake_core',
        name: '跳跳糖芯',
        description: '每引爆 {coreEvery} 枚炸弹，就送你 {coreGive} 枚炸弹。',
        route: 'bake',
        tags: ['bomb']
      }, {
        id: 'bake_caramel',
        name: '焦糖外壳',
        description: '被炸弹炸掉的商品，得分多 {caramel%}%。',
        route: 'bake',
        tags: ['bomb']
      }, {
        id: 'bake_candle',
        name: '生日蜡烛',
        description: '同一次交换里接连炸了好几枚炸弹时，第 2 枚得分多 {candleStep%}%，第 3 枚起多 {candleMax%}%。',
        route: 'bake',
        tags: ['bomb']
      }, {
        id: 'bake_oven',
        name: '烤箱预热',
        description: '每交一单，就送你 1 枚炸弹。',
        route: 'bake',
        tags: ['bomb', 'order']
      }, {
        id: 'bake_fuse',
        name: '引信',
        description: '每引爆 1 枚炸弹或 1 个线消，上场的猫各攒 {fuseCharge} 点能量。',
        route: 'bake',
        tags: ['bomb', 'line']
      }, {
        id: 'bake_timer',
        name: '定时烤盘',
        description: '每引爆 {specialEvery} 枚炸弹，就再得 {counterScore} 分，算进当前订单。',
        route: 'bake',
        tags: ['bomb']
      }, {
        id: 'display_feature',
        name: '心愿清单',
        description: "\u6D88\u9664\u504F\u597D\u54C1\u65F6\uFF0C" + ZW + "\u5F97\u5206\u4ECE 2 \u500D" + ZW + "\u53D8\u6210 {prefMult} \u500D\u3002",
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'display_filter',
        name: '精简货架',
        description: '补货时只会出现 4 种商品，两种偏好品一定在里面。',
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'display_pair',
        name: '同款陈列',
        description: '每次交换后补货时，会把棋盘上 1 件商品变成偏好品。',
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'display_regular',
        name: '回头熟客',
        description: '连消到第 3 轮以后，消除偏好品的得分再多 {regular%}%。',
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'display_window',
        name: '热销橱窗',
        description: '每消除 {windowEvery} 件偏好品，接下来补上的 {windowRefill} 件都会是偏好品。',
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'display_sample',
        name: '试吃小样',
        description: '每交一单，下次补货时会把 {sampleConvert} 件商品变成偏好品。',
        route: 'display',
        tags: ['preferred', 'order']
      }, {
        id: 'display_tag',
        name: '爆款标签',
        description: '消除偏好品时，得分多 {tag%}%。',
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'display_rush',
        name: '限时抢购',
        description: '每消除 {rushEvery} 件偏好品，就再得 {counterScore} 分，算进当前订单。',
        route: 'display',
        tags: ['preferred']
      }, {
        id: 'general_ledger',
        name: '招财账本',
        description: '每交一单，下一单就先装进 {ledger} 分。',
        route: 'general',
        tags: ['order']
      }, {
        id: 'general_hourglass',
        name: '营业沙漏',
        description: '所有加时都多 {hourglass%}%，越到后面加得越少这一点不变。',
        route: 'general',
        tags: ['order']
      }, {
        id: 'general_stamp',
        name: '熟客印章',
        description: '从下一单起，每单需要的分数少 {stamp%}%。',
        route: 'general',
        tags: ['order']
      }]);
      goods.forEach(function (good, i) {
        var kind = i + 1;
        upgrades.push({
          id: "stock_" + good.id + "_more",
          name: L('{0}多进', good.name),
          description: L('{0}随机补货权重 ×2', good.name),
          route: 'general',
          refillKind: kind,
          refillMultiplier: 2
        });
        upgrades.push({
          id: "stock_" + good.id + "_less",
          name: L('{0}少进', good.name),
          description: L('{0}随机补货权重 ×0.5', good.name),
          route: 'general',
          refillKind: kind,
          refillMultiplier: .5
        });
      });
      function Cat(id) {
        var _cats$find;
        return (_cats$find = cats.find(function (c) {
          return c.id === id;
        })) != null ? _cats$find : retiredCats.find(function (c) {
          return c.id === id;
        });
      }
      function CatLevelCost(id, level) {
        var _cat$levelCosts;
        var cat = Cat(id);
        if (!cat) return undefined;
        return ((_cat$levelCosts = cat.levelCosts) != null ? _cat$levelCosts : levelCosts)[level - 1];
      }
      var SKILL_POWER = exports('SKILL_POWER', {
        collect: [3, 4, 5],
        line: [1, 2, 3],
        bomb: [1, 2, 2],
        time: [2, 3, 4],
        score: [60, 90, 120],
        cuddle: [30, 40, 50],
        detonate: [2, 3, 4]
      });
      var SKILL_LINKED_BONUS = exports('SKILL_LINKED_BONUS', {});
      var CUDDLE_ALONE_SECONDS = exports('CUDDLE_ALONE_SECONDS', [2, 3, 4]);
      function CatLevel(id, levelIn) {
        var _SKILL_POWER$cat$skil, _ref, _cat$levelPowers, _cat$levelPowers2, _cat$levelCharges, _cat$levelCharges2, _bonuses;
        var cat = Cat(id);
        var level = Math.max(1, Math.min(5, levelIn != null ? levelIn : 1));
        var chargeSteps = level >= 4 && 2 || level >= 2 && 1 || 0;
        var powerStep = 1;
        if (level >= 5) powerStep = 3;else if (level >= 3) powerStep = 2;
        var powers = (_SKILL_POWER$cat$skil = SKILL_POWER[cat.skill]) != null ? _SKILL_POWER$cat$skil : [1, 1, 1];
        var power = (_ref = (_cat$levelPowers = (_cat$levelPowers2 = cat.levelPowers) == null ? void 0 : _cat$levelPowers2[level - 1]) != null ? _cat$levelPowers : powers[powerStep - 1]) != null ? _ref : 1;
        var bonuses = SKILL_LINKED_BONUS[cat.skill];
        var charge = (_cat$levelCharges = (_cat$levelCharges2 = cat.levelCharges) == null ? void 0 : _cat$levelCharges2[level - 1]) != null ? _cat$levelCharges : level === 5 && cat.maxLevelCharge || Math.floor(cat.charge * (1 - .1 * chargeSteps) + .5);
        return {
          charge: charge,
          power: power,
          linkedBonus: (_bonuses = bonuses == null ? void 0 : bonuses[powerStep - 1]) != null ? _bonuses : 0
        };
      }
      function SkillText(id, level) {
        var cat = Cat(id);
        var n = CatLevel(id, level).power;
        if (cat.skill === 'collect') return L("\u628A {0} \u4EF6\u5546\u54C1" + ZW + "\u53D8\u6210\u504F\u597D\u54C1\u3002", n);
        if (cat.skill === 'bomb') return L("\u5728\u68CB\u76D8\u4E0A" + ZW + "\u653E {0} \u679A\u70B8\u5F39\u3002", n);
        if (cat.skill === 'line') return L("\u5728\u68CB\u76D8\u4E0A" + ZW + "\u653E {0} \u4E2A\u7EBF\u6D88\u3002", n);
        var shown = n >= 99 ? L('全部') : String(n);
        var alone = CUDDLE_ALONE_SECONDS[level >= 5 ? 2 : level >= 3 ? 1 : 0];
        return L(cat.description).replaceAll('{n}', shown).replaceAll('{s}', String(alone)).replaceAll('{一}', n === 1 ? '一' : " " + n + " ");
      }
      function SkillValue(id, level) {
        var cat = Cat(id);
        var n = CatLevel(id, level).power;
        var fmt = {
          collect: '偏好品 %d 件',
          line: '线消 %d 个',
          bomb: '炸弹 %d 枚',
          time: '加时 %d 秒',
          score: '加 %d 分',
          cuddle: '搭档 +%d%%',
          detonate: '引爆 %d 枚'
        };
        if (cat.skill === 'detonate' && n >= 99) return L('引爆全部');
        return L(fmt[cat.skill]).replace('%d', String(n)).replace('%%', '%');
      }
      var CAT_SCORE_MULT = exports('CAT_SCORE_MULT', {
        tuantuan: 9.5,
        zhima: 4.0,
        huajuan: 3.8,
        ragdoll: 6.0,
        tuxedo: 3.8
      });
      var UPGRADE_SLOT_CAP = exports('UPGRADE_SLOT_CAP', 5);
      // Public review build (package-web.cjs demo, user 2026-10-30): no cat points are earned and a run takes at most 3
      // items. A mutable object rather than a `let` export: Cocos's loose module transform does not keep live bindings.
      var DEMO = exports('DEMO', {
        on: false
      });
      var DEMO_SLOT_CAP = exports('DEMO_SLOT_CAP', 3);
      function UpgradeSlotCap() {
        return DEMO.on ? DEMO_SLOT_CAP : UPGRADE_SLOT_CAP;
      }
      var UPGRADE_FIRST_ORDERS = exports('UPGRADE_FIRST_ORDERS', [1, 3, 5, 7, 11]);
      var REROLL_BASE = exports('REROLL_BASE', 1),
        REROLL_MAX = exports('REROLL_MAX', 3),
        REROLL_MAX_LEVEL = exports('REROLL_MAX_LEVEL', 5),
        REROLL_AD_AMOUNT = exports('REROLL_AD_AMOUNT', 2),
        REROLL_AD_DAILY_CAP = exports('REROLL_AD_DAILY_CAP', 5);
      var RELEASE_POOL_IDS = exports('RELEASE_POOL_IDS', ['display_feature', 'display_filter', 'display_pair', 'display_regular', 'display_window', 'display_sample', 'display_tag', 'display_rush', 'bake_foam', 'bake_tray', 'bake_core', 'bake_caramel', 'bake_candle', 'bake_oven', 'bake_fuse', 'bake_timer', 'ribbon_spool', 'ribbon_cross', 'ribbon_relay', 'ribbon_tip', 'ribbon_finale', 'ribbon_bow', 'ribbon_wide', 'ribbon_measure', 'general_ledger', 'general_hourglass', 'general_stamp']);
      var RELEASE_CAT_IDS = exports('RELEASE_CAT_IDS', ['tuantuan', 'zhima', 'huajuan', 'ragdoll', 'tuxedo']);
      var BAKE_CORE_LINKED_THRESHOLD = exports('BAKE_CORE_LINKED_THRESHOLD', 1);
      var BAKE_CANDLE_STEP = exports('BAKE_CANDLE_STEP', .15);
      var BAKE_CANDLE_MAX = exports('BAKE_CANDLE_MAX', .3);
      var ITEM_TUNING = exports('ITEM_TUNING', {
        foamEvery: 2,
        sampleConvert: 2,
        tag: 0.8,
        counterScore: 100,
        rushEvery: 15,
        specialEvery: 4,
        ribbonEvery: 3,
        bowCount: 2,
        fuseCharge: 1,
        coreEvery: 5,
        coreGive: 4,
        relayEvery: 3,
        relayGive: 1,
        caramel: 0.8,
        tip: .25,
        regular: 1.6,
        candleMax: .3,
        candleStep: .15,
        finaleMax: .7,
        finaleStep: .1,
        windowEvery: 15,
        windowRefill: 3,
        prefMult: 3.5,
        trayRadius: 2,
        ledger: 80,
        stamp: .1,
        hourglass: .15,
        spoolEvery: 20
      });
      var SKILL_ICON = exports('SKILL_ICON', {
        collect: 'icon.cat.skill.collect',
        bomb: 'ui.r02.special.bomb',
        line: 'icon.cat.skill.line',
        cuddle: 'icon.cat.skill.cuddle',
        detonate: 'icon.cat.skill.detonate'
      });
      function SkillIcon(id) {
        var cat = Cat(id);
        return cat && SKILL_ICON[cat.skill] || SKILL_ICON.collect;
      }
      function IsReleasedCat(id) {
        return RELEASE_CAT_IDS.includes(id);
      }
      function IsReleased(id) {
        return RELEASE_POOL_IDS.includes(id);
      }
      function Upgrade(id) {
        return upgrades.find(function (u) {
          return u.id === id;
        });
      }
      function ReleasePool() {
        var pool = [];
        for (var _iterator = _createForOfIteratorHelperLoose(RELEASE_POOL_IDS), _step; !(_step = _iterator()).done;) {
          var id = _step.value;
          var u = Upgrade(id);
          if (u) pool.push(u);
        }
        return pool;
      }
      var routes = exports('routes', {
        ribbon: {
          name: '缎带工坊',
          cat: 'huajuan'
        },
        bake: {
          name: '软糖烘焙',
          cat: 'zhima'
        },
        display: {
          name: '精选橱窗',
          cat: 'tuantuan'
        },
        general: {
          name: '通用',
          cat: false
        }
      });
      var TAGS = exports('TAGS', {
        preferred: {
          name: '偏好',
          icon: 'ui.tag.preferred'
        },
        bomb: {
          name: '爆炸',
          icon: 'ui.tag.bomb'
        },
        line: {
          name: '线消',
          icon: 'ui.tag.line'
        },
        order: {
          name: '订单',
          icon: 'ui.tag.order'
        }
      });
      var TAG_ORDER = exports('TAG_ORDER', ['preferred', 'bomb', 'line', 'order']);
      // Card copy placeholders: {key} is ITEM_TUNING[key]; {key%} is it as a whole percent (0.3 -> 30).
      function ItemText(text) {
        return text.replace(/\{(\w+)(%?)\}/g, function (whole, key, percent) {
          var v = ITEM_TUNING[key];
          if (v === undefined) return whole;
          if (percent === '%') return String(Math.floor(v * 100 + .5));
          return localDecimal(String(v));
        });
      }
      function Points(score) {
        return Math.floor(POINT_CAP * score / (score + POINT_KNEE));
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/design.ts", ['cc', './kit.ts', './assets.ts'], function (exports) {
  var cclegacy, UI, resolveAsset;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }],
    execute: function () {
      exports({
        AnchorGroup: AnchorGroup,
        Art: Art,
        CatPlaceholder: CatPlaceholder,
        Label: Label,
        PageFill: PageFill,
        SceneBackground: SceneBackground,
        ShopBackground: ShopBackground,
        TallBands: TallBands,
        UpgradeArt: UpgradeArt
      });
      cclegacy._RF.push({}, "5b2d70zJaFMHrvbnjlR2g/X", "design", undefined);
      var colors = exports('colors', {
        ink: [68, 51, 38, 255],
        muted: [118, 97, 79, 255],
        cream: [255, 248, 234, 255],
        paper: [255, 248, 234, 255],
        pageOutside: [224, 213, 192, 255],
        peach: [239, 130, 94, 255],
        mint: [40, 116, 86, 255],
        line: [207, 189, 161, 255],
        soft: [244, 229, 205, 255],
        red: [181, 61, 61, 255]
      });
      var K = colors;
      function Label(text, size, color) {
        if (size === void 0) {
          size = 16;
        }
        return UI.Label({
          minFontSize: 9,
          text: text,
          fontSize: size * .75,
          fontColor: color != null ? color : K.ink,
          textAlign: 'center',
          whiteSpace: 'normal',
          fontFamily: 'body',
          pointerEvents: 'none'
        });
      }
      function Art(id, w, h, fallback) {
        if (fallback === void 0) {
          fallback = '';
        }
        var item = resolveAsset(id);
        var art = UI.Panel({
          width: w,
          height: h,
          backgroundImage: item ? item.path : null,
          backgroundFit: 'contain',
          pointerEvents: 'none'
        });
        if (!item && fallback) art.AddChild(Label(fallback, Math.min(w, h) * .4, K.muted));
        return art;
      }

      // Page-outside blur fill (docs/screen-compatibility-plan.md 2026-10-25): one blurred image per page background.
      var FILL = {
        'home.r02': 'home',
        'cats.r02': 'cats',
        cats: 'cats',
        rank: 'rank'
      };
      function PageFill(key) {
        var asset = key ? resolveAsset('ui.fill.' + key) : undefined;
        return UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backgroundColor: K.pageOutside,
          backgroundImage: asset ? asset.path : null,
          backgroundFit: 'cover'
        });
      }
      // Tall-screen extensions of a page background (2026-10-29, 20:9-class phones): 100-unit bands painted to continue the
      // scene above and below the 360x640 page, so taller screens show more of the scene instead of the blurred fill. The
      // app places them against the page (App.FitPage); keys without bands keep the fill only.
      var TALL_BAND = exports('TALL_BAND', 100);
      function TallBands(key) {
        var top = key ? resolveAsset('ui.tall.' + key + '.top') : undefined,
          bottom = key ? resolveAsset('ui.tall.' + key + '.bottom') : undefined;
        if (!top || !bottom) return undefined;
        var band = function band(path) {
          return UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 360,
            height: TALL_BAND,
            backgroundImage: path,
            backgroundFit: 'fill',
            pointerEvents: 'none'
          });
        };
        return [band(top.path), band(bottom.path)];
      }
      // Tall-screen layout (2026-10-29, user: move the top UI up and the bottom UI down once the bands extend the page):
      // elements built into an anchor group follow the screen edge. The app moves each group by the extra safe-area height
      // above or below the page, at most TALL_BAND (App.FitPage), so hanging plates still hang from the screen top and the
      // bottom buttons sit near the bottom edge; everything else keeps its 360x640 position.
      function AnchorGroup(page, side) {
        var group = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          pointerEvents: 'none',
          overflow: 'visible'
        });
        group.props.anchor = side;
        page.AddChild(group);
        return group;
      }
      function SceneBackground(page, w, h, scene) {
        page.props.fillKey = FILL[scene];
        var asset = resolveAsset('scene.' + scene);
        if (asset) {
          page.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: w,
            height: h,
            backgroundImage: asset.path,
            backgroundFit: 'cover',
            pointerEvents: 'none'
          }));
        } else {
          var _fallback$scene;
          var fallback = {
            title: [172, 222, 214, 255],
            cats: [232, 234, 206, 255],
            rank: [238, 212, 155, 255],
            result: [201, 169, 126, 255]
          };
          page.SetStyle({
            backgroundColor: (_fallback$scene = fallback[scene]) != null ? _fallback$scene : K.cream
          });
          page.AddChild(UI.Panel({
            position: 'absolute',
            left: w * .12,
            top: h * .12,
            width: w * .76,
            height: h * .45,
            borderRadius: 48,
            backgroundColor: [255, 244, 218, 210],
            pointerEvents: 'none'
          }));
        }
      }
      function CatPlaceholder(id, w, h) {
        var art = Art('cat.' + id + '.portrait', w, h, '猫');
        art.SetStyle({
          opacity: .94
        });
        return art;
      }
      // Play background: top surface, the middle strip repeated, bottom surface (941-wide art scaled to the page width).
      function ShopBackground(page, w, h) {
        var scale = w / 941;
        var top = 606 * scale,
          bottom = 292 * scale,
          middle = 326 * scale;
        var image = function image(id, y, height) {
          var asset = resolveAsset('ui.r02.background.' + id);
          return UI.Panel({
            position: 'absolute',
            left: 0,
            top: y,
            width: w,
            height: height,
            backgroundImage: asset ? asset.path : null,
            backgroundFit: 'fill',
            pointerEvents: 'none'
          });
        };
        var topSurface = image('top', 0, top);
        page.AddChild(topSurface);
        var strip = UI.Panel({
          position: 'absolute',
          left: 0,
          top: top,
          width: w,
          height: Math.max(0, h - top - bottom),
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        for (var y = 0; y < h - top - bottom; y += middle) strip.AddChild(image('middle', y, middle));
        page.AddChild(strip);
        page.AddChild(image('bottom', h - bottom, bottom));
        page.props.fillKey = 'shop';
        return topSurface;
      }
      function UpgradeArt(upgrade, size, goods) {
        var _upgrade$refillMultip;
        if (upgrade.refillKind === undefined || !goods) return Art('upgrade.' + upgrade.id, size, size, '助');
        var good = goods[upgrade.refillKind - 1];
        var art = Art('ui.r02.tile.' + good.id, size, size, good.symbol);
        var more = ((_upgrade$refillMultip = upgrade.refillMultiplier) != null ? _upgrade$refillMultip : 1) > 1;
        var arrow = Label(more ? '↑' : '↓', Math.max(12, size * .42), more ? K.mint : [56, 103, 150, 255]);
        var aw = Math.max(13, size * .44),
          ah = Math.max(14, size * .48);
        arrow.SetStyle({
          position: 'absolute',
          left: size - aw,
          top: size - ah,
          width: aw,
          height: ah,
          backgroundColor: K.paper,
          borderRadius: 5,
          fontFamily: 'sans'
        });
        art.AddChild(arrow);
        return art;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/dev.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy;
  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        devPlatform: devPlatform,
        fakeAds: fakeAds
      });
      cclegacy._RF.push({}, "a45efZuOoNJV4NOP38AbfLr", "dev", undefined); // Local development platform: in-memory saves and a fake rewarded ad (Maker repo scripts/Game/Ads.lua adapters.fake).
      function fakeAds(mode) {
        if (mode === void 0) {
          mode = function mode() {
            return 'success';
          };
        }
        return {
          name: 'fake',
          available: function available() {
            return true;
          },
          show: function show(done, started) {
            var m = mode();
            if (m === 'reject') return false;
            if (m === 'sync_fail') {
              done(false, 'sync fail');
              return false;
            }
            started == null || started();
            if (m === 'silent') return true;
            queueMicrotask(function () {
              if (m === 'fail') done(false, 'load fail');else if (m === 'close') done(false, 'closed early');else {
                done(true);
                if (m === 'twice') done(true);
              }
            });
            return true;
          }
        };
      }
      function devPlatform(languages) {
        if (languages === void 0) {
          languages = ['zh_CN'];
        }
        var slots = new Map();
        return {
          id: 'dev',
          storage: {
            read: function read(slot) {
              return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                var s;
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      s = slots.get(slot);
                      return _context.abrupt("return", s === undefined ? {} : {
                        data: JSON.parse(s)
                      });
                    case 2:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }))();
            },
            write: function write(slot, data) {
              return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      slots.set(slot, JSON.stringify(data));
                      return _context2.abrupt("return", {
                        ok: true
                      });
                    case 2:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }))();
            }
          },
          ads: fakeAds(),
          lifecycle: {
            onPause: function onPause() {},
            onResume: function onResume() {},
            onBack: function onBack() {}
          },
          locale: {
            preferred: function preferred() {
              return languages;
            }
          },
          shell: {
            safeArea: function safeArea() {
              return {
                left: 0,
                top: 0,
                width: 360,
                height: 640
              };
            }
          }
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/feedback.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './design.ts', './config.ts', './i18n.ts', './skillItemVfx.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, UI, Art, Label, colors, goods, Cat, PRESENTATION, L, Rainbow, PawGeometry;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Art = module.Art;
      Label = module.Label;
      colors = module.colors;
    }, function (module) {
      goods = module.goods;
      Cat = module.Cat;
      PRESENTATION = module.PRESENTATION;
    }, function (module) {
      L = module.L;
    }, function (module) {
      Rainbow = module.Rainbow;
      PawGeometry = module.PawGeometry;
    }],
    execute: function () {
      exports({
        Clear: Clear,
        Order: Order,
        Time: Time,
        UpdateOrder: UpdateOrder
      });
      cclegacy._RF.push({}, "cfb342XXchNz5UQUxXNKZfT", "feedback", undefined);
      function animate(parent, widget, frames, duration) {
        parent.AddChild(widget);
        // Linear: a global ease-out compresses the later hold/fade keyframes and ends a long message early.
        widget.Animate({
          keyframes: frames,
          duration: duration,
          easing: 'linear',
          fillMode: 'both',
          onComplete: function onComplete() {
            return widget.Destroy();
          }
        });
      }
      function beam(board, x1, y1, x2, y2, width, color, ribbon) {
        var dx = x2 - x1,
          dy = y2 - y1,
          len = Math.sqrt(dx * dx + dy * dy);
        var line = UI.Panel({
          position: 'absolute',
          left: (x1 + x2) / 2 - len / 2,
          top: (y1 + y2) / 2 - width / 2,
          width: Math.max(1, len),
          height: width,
          rotate: Math.atan2(dy, dx) * 180 / Math.PI,
          backgroundColor: color,
          borderRadius: width / 2,
          pointerEvents: 'none',
          borderWidth: ribbon ? 1.5 : 0,
          borderColor: ribbon ? [226, 138, 58, 255 * .9] : undefined
        });
        animate(board, line, {
          0: {
            scale: .15,
            opacity: 0
          },
          .22: {
            scale: .2,
            opacity: 1
          },
          .6: {
            scale: 1,
            opacity: 1
          },
          1: {
            scale: 1.08,
            opacity: 0
          }
        }, .48);
      }
      function Clear(app, event) {
        var g = app.g,
          refs = g.play;
        var size = g.cellSize;
        var board = refs.board;
        var width = size * 7;
        for (var _i = 0, _arr = (_event$specials = event.specials) != null ? _event$specials : []; _i < _arr.length; _i++) {
          var _event$specials;
          var effect = _arr[_i];
          var x = (effect.c - .5) * size,
            y = (effect.r - .5) * size;
          if (effect.kind === 'row' || effect.kind === 'column') {
            // 宽幅缎带 also clears the next row / column (the previous one at the edge, as in Run:ExpandSpecials).
            var y2 = effect.wide ? ((effect.r < 7 ? effect.r + 1 : effect.r - 1) - .5) * size : undefined;
            var x2 = effect.wide ? ((effect.c < 7 ? effect.c + 1 : effect.c - 1) - .5) * size : undefined;
            var gold = [255, 248, 175, 245];
            if (effect.kind === 'row' || effect.cross) {
              beam(board, 0, y, width, y, size * .3, gold, true);
              if (y2 !== undefined) beam(board, 0, y2, width, y2, size * .3, gold, true);
            }
            if (effect.kind === 'column' || effect.cross) {
              beam(board, x, 0, x, width, size * .3, gold, true);
              if (x2 !== undefined) beam(board, x2, 0, x2, width, size * .3, gold, true);
            }
          } else if (effect.kind === 'bomb') {
            var _effect$radius;
            var diameter = (((_effect$radius = effect.radius) != null ? _effect$radius : 1) * 2 + 1) * size;
            var ring = UI.Panel({
              position: 'absolute',
              left: x - diameter / 2,
              top: y - diameter / 2,
              width: diameter,
              height: diameter,
              borderRadius: 12,
              borderWidth: 5,
              borderColor: [236, 153, 73, 240],
              backgroundColor: [255, 231, 122, 85],
              pointerEvents: 'none'
            });
            animate(board, ring, {
              0: {
                scale: .15,
                opacity: 0
              },
              .25: {
                scale: .35,
                opacity: 1
              },
              .65: {
                scale: 1,
                opacity: .9
              },
              1: {
                scale: 1.06,
                opacity: 0
              }
            }, .48);
          }
          // Rainbow: slot-to-cell and rainbow beams share the warm-gold renderer and glowing head (SkillItemVfx).
        }

        Rainbow(app, event);
        var page = app.page;
        var box = board.RectIn(page),
          order = refs.orderCard.RectIn(page);
        var cells = event.cells;
        var i = 0;
        for (var _iterator = _createForOfIteratorHelperLoose(cells), _step; !(_step = _iterator()).done;) {
          var cell = _step.value;
          if (cell.cell.credited || i >= 4) continue;
          i++;
          var _x = box.x + (cell.c - .5) * size,
            _y = box.y + (cell.r - .5) * size;
          var item = Art('ui.r02.tile.' + goods[cell.cell.kind - 1].id, size * .35, size * .35, '');
          item.SetStyle({
            position: 'absolute',
            left: _x,
            top: _y,
            pointerEvents: 'none'
          });
          var dx = order.x + order.w * .5 - _x,
            dy = order.y + order.h * .7 - _y;
          animate(page, item, {
            0: {
              scale: .65,
              opacity: 0
            },
            .25: {
              scale: 1,
              opacity: 1
            },
            .92: {
              translateX: dx,
              translateY: dy,
              scale: .4,
              opacity: 1
            },
            1: {
              translateX: dx,
              translateY: dy,
              scale: .3,
              opacity: 0
            }
          }, .54 + i * .02);
        }
        var first = cells[Math.ceil(cells.length / 2) - 1];
        var eventScore = event.score,
          cascade = event.cascade;
        if (first && eventScore > 0) {
          var _refs$waveScore;
          (_refs$waveScore = refs.waveScore) == null || _refs$waveScore.Destroy();
          var s = g.playWidth / 390;
          var w = (cascade > 1 ? 128 : 96) * s;
          var left = Math.max(0, Math.min(box.w - w, (first.c - .5) * size - w / 2));
          var top = (first.r - .5) * size - 14 * s;
          var height = 28 * s;
          var after = event.after,
            before = event.before;
          var made = cells.filter(function (p) {
            var a = after[p.r][p.c],
              b = before[p.r][p.c];
            return a && a.special && (!b || a.uid !== b.uid || a.special !== b.special);
          });
          // Include the paper's scale overshoot and upward travel in its swept bounds.
          var overlaps = function overlaps(y, p) {
            return left - w * .02 < p.c * size && left + w * 1.02 > (p.c - 1) * size && y - 20 * s - height * .02 < p.r * size && y + height * 1.02 > (p.r - 1) * size;
          };
          var free = function free(y) {
            return made.every(function (p) {
              return !overlaps(y, p);
            });
          };
          if (!free(top)) {
            for (var _iterator2 = _createForOfIteratorHelperLoose(made), _step2; !(_step2 = _iterator2()).done;) {
              var p = _step2.value;
              var above = (p.r - 1) * size - 2 - height * 1.02;
              var below = p.r * size + 2 + 20 * s + height * .02;
              if (above - 20 * s - height * .02 >= 0 && free(above)) {
                top = above;
                break;
              }
              if (free(below)) {
                top = below;
                break;
              }
            }
          }
          var label = cascade > 1 ? L('{0}连消 +{1}', cascade, Math.floor(eventScore)) : '+' + Math.floor(eventScore);
          var score = Label(label, 22 * s, cascade > 1 ? [205, 96, 38, 255] : colors.ink);
          score.SetStyle({
            position: 'absolute',
            left: box.x + left,
            top: box.y + top,
            width: w,
            height: height,
            fontFamily: 'sans',
            whiteSpace: 'nowrap',
            backgroundColor: [255, 248, 226, 255],
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: [143, 92, 48, 220]
          });
          refs.waveScore = score;
          animate(page, score, {
            0: {
              scale: .85,
              opacity: 1
            },
            .2: {
              scale: 1.04,
              opacity: 1,
              translateY: -8 * s
            },
            .78: {
              scale: 1,
              opacity: 1,
              translateY: -8 * s
            },
            1: {
              translateY: -20 * s,
              opacity: 0
            }
          }, PRESENTATION.score);
        }
      }
      function Time(app, event) {
        var g = app.g,
          refs = g.play,
          page = app.page;
        var order = refs.orderCard.RectIn(page),
          clock = refs.timerPlate.RectIn(page),
          gain = refs.timeGainChip.RectIn(page);
        var solo = g.run.cats.length === 1 && g.run.cats[0].id === 'ragdoll' && event.amounts[Cat('ragdoll').name] !== undefined;
        refs.timePoints = [];
        for (var i = 1; i <= 3; i++) {
          var size = solo ? 9 : 7;
          var x = order.x + order.w * .65 + i * 7 + size / 2,
            y = order.y + 12 + size / 2;
          var points = void 0;
          if (solo) {
            points = PawGeometry(app, 'ragdoll', {
              hud: 'timer'
            }).points;
            x = points[0].x;
            y = points[0].y;
          } else {
            // Below the toast, through the gap between the cats, then left of the tag; the centre lands between the
            // plaque bottom and the tag top.
            var gap = 178,
              below = gain.y + gain.h + 12,
              outside = gain.x - 6;
            var tx = clock.x + clock.w / 2,
              ty = (clock.y + clock.h + gain.y) / 2;
            points = [{
              x: x,
              y: y
            }, {
              x: gap,
              y: refs.orderCard.props.top - 2
            }, {
              x: gap,
              y: below
            }, {
              x: outside,
              y: below
            }, {
              x: outside,
              y: ty
            }, {
              x: tx,
              y: ty
            }];
          }
          var point = solo ? Art('fx.star', size, size, '') : UI.Panel({
            width: size,
            height: size,
            borderRadius: 4,
            backgroundColor: colors.mint
          });
          var carrier = UI.Panel({
            position: 'absolute',
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            pointerEvents: 'none',
            overflow: 'visible'
          });
          carrier.AddChild(point);
          refs.timePoints.push(carrier);
          // Motion on the unscaled carrier, so the dot follows the authored lane at every age.
          var frames = {
            0: {
              translateX: 0,
              translateY: 0
            },
            .2: {
              translateX: 0,
              translateY: 0
            }
          };
          for (var k = 1; k < points.length; k++) frames[.2 + .65 * k / (points.length - 1)] = {
            translateX: points[k].x - x,
            translateY: points[k].y - y
          };
          var last = points[points.length - 1];
          frames[1] = {
            translateX: last.x - x,
            translateY: last.y - y
          };
          var duration = .55 + i * .03;
          point.Animate({
            keyframes: {
              0: {
                opacity: 0,
                scale: .5
              },
              .2: {
                opacity: 1,
                scale: 1
              },
              .85: {
                opacity: 1,
                scale: .7
              },
              1: {
                opacity: 0,
                scale: .5
              }
            },
            duration: duration,
            easing: 'linear',
            fillMode: 'both'
          });
          animate(page, carrier, frames, duration);
        }
      }
      function UpdateOrder(app, receipt) {
        var _receipt$bonus;
        var refs = app.g.play;
        if (!refs.orderStamp || !refs.orderStamp.parent) return;
        refs.orderStampTitle.SetText(receipt.count > 1 ? L('连续完成 {0} 单！', receipt.count) : L('第 {0} 单完成！', receipt.firstIndex));
        // An order completed after 00:00 adds no time, so the stamp shows no "+0.0 秒" line.
        var timed = ((_receipt$bonus = receipt.bonus) != null ? _receipt$bonus : 0) > 0;
        refs.orderStampBonus.SetText(timed ? L('交单  +{0} 秒', receipt.bonus.toFixed(1)) : '');
        refs.orderStampBonus.SetStyle({
          visible: timed
        });
        layoutStamp(refs.orderStamp, refs.orderStampTitle, refs.orderStampBonus, timed);
      }
      // The Maker stamp centres its two labels in a column (alignItems/justifyContent center, gap 2s).
      function layoutStamp(stamp, title, detail, timed) {
        var _stamp$GetLayout = stamp.GetLayout(),
          w = _stamp$GetLayout.w,
          h = _stamp$GetLayout.h;
        var s = w / 200;
        var th = 22 * .75 * 4 / 3 * 1.3,
          dh = 13 * .75 * 4 / 3 * 1.3,
          gap = 2 * s;
        var total = timed ? th + gap + dh : th;
        title.SetStyle({
          position: 'absolute',
          left: 0,
          top: (h - total) / 2,
          width: w,
          height: th,
          whiteSpace: 'nowrap'
        });
        detail.SetStyle({
          position: 'absolute',
          left: 0,
          top: (h - total) / 2 + th + gap,
          width: w,
          height: dh,
          whiteSpace: 'nowrap'
        });
      }
      function Order(app, count, bonus, index) {
        var _refs$orderStamp;
        var g = app.g,
          refs = g.play,
          page = app.page;
        var order = refs.orderCard;
        order.Animate({
          keyframes: {
            0: {
              scale: 1
            },
            .3: {
              scale: 1.025
            },
            1: {
              scale: 1
            }
          },
          duration: .55,
          fillMode: 'both'
        });
        var width = g.playWidth,
          s = width / 390;
        (_refs$orderStamp = refs.orderStamp) == null || _refs$orderStamp.Destroy();
        // Stamped onto the order card itself (above it, it covered both cats when a skill fired as an order completed).
        var top = order.props.top + (order.props.height - 58 * s) / 2;
        var stamp = UI.Panel({
          position: 'absolute',
          left: (width - 200 * s) / 2,
          top: top,
          width: 200 * s,
          height: 58 * s,
          backgroundColor: [255, 232, 171, 255],
          borderRadius: 14 * s,
          borderWidth: 2 * s,
          borderColor: [150, 106, 53, 255],
          pointerEvents: 'none'
        });
        var title = Label('', 22 * s, colors.ink);
        title.SetStyle({
          fontFamily: 'sans'
        });
        var detail = Label('', 13 * s, colors.mint);
        stamp.AddChild(title);
        stamp.AddChild(detail);
        refs.orderStamp = stamp;
        refs.orderStampTitle = title;
        refs.orderStampBonus = detail;
        animate(page, stamp, {
          0: {
            scale: 1.18,
            opacity: 0,
            rotate: -6
          },
          .14: {
            scale: 1,
            opacity: 1,
            rotate: -2
          },
          .88: {
            scale: 1,
            opacity: 1,
            rotate: -2
          },
          1: {
            scale: .98,
            opacity: 0
          }
        }, PRESENTATION.hold);
        UpdateOrder(app, {
          count: count,
          bonus: bonus,
          firstIndex: index != null ? index : 1
        });
        for (var i = 1; i <= 8; i++) {
          var star = Art('fx.star', 20, 20, '✦');
          star.SetStyle({
            position: 'absolute',
            left: width / 2,
            top: top + 20,
            pointerEvents: 'none'
          });
          var angle = i * Math.PI / 4;
          animate(page, star, {
            0: {
              scale: .3,
              opacity: 0
            },
            .2: {
              scale: 1,
              opacity: 1
            },
            1: {
              translateX: Math.cos(angle) * 126,
              translateY: Math.sin(angle) * 65,
              opacity: 0,
              rotate: 70
            }
          }, 1.1);
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './run.ts', './config.ts', './presentation.ts', './i18n.ts', './assets.ts', './kit.ts', './design.ts', './catView.ts', './play.ts', './feedback.ts', './skillItemVfx.ts', './tips.ts', './ads.ts', './adLoading.ts', './rerollAd.ts', './itemOverlay.ts', './resultAd.ts', './result.ts', './resumeCountdown.ts', './pause.ts', './audio.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, Run, SIZE, Upgrade, goods, Cat, PRESENTATION, RECOVERY_FADE_END, Presentation, L, resolveAsset, UI, colors, Clear, Release, Play, Build, Refresh, Clear$1, Time, Order, UpdateOrder, Build$1, Items, Cell, Skill, Update$6, Begin, Blocked$1, Event, Update$5, Waiting, InputBlocked, Update$1, Blocked, Update$4, Update$3, ShowChoice, ShowDetail, Update$2, Result, Start, Update$7, Pause, pauseAudio, resumeAudio, setMusic, playCue;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Run = module.Run;
    }, function (module) {
      SIZE = module.SIZE;
      Upgrade = module.Upgrade;
      goods = module.goods;
      Cat = module.Cat;
      PRESENTATION = module.PRESENTATION;
      RECOVERY_FADE_END = module.RECOVERY_FADE_END;
    }, function (module) {
      Presentation = module.Presentation;
    }, function (module) {
      L = module.L;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      colors = module.colors;
    }, function (module) {
      Clear = module.Clear;
      Release = module.Release;
      Play = module.Play;
    }, function (module) {
      Build = module.Build;
      Refresh = module.Refresh;
    }, function (module) {
      Clear$1 = module.Clear;
      Time = module.Time;
      Order = module.Order;
      UpdateOrder = module.UpdateOrder;
    }, function (module) {
      Build$1 = module.Build;
      Items = module.Items;
      Cell = module.Cell;
      Skill = module.Skill;
      Update$6 = module.Update;
    }, function (module) {
      Begin = module.Begin;
      Blocked$1 = module.Blocked;
      Event = module.Event;
      Update$5 = module.Update;
      Waiting = module.Waiting;
      InputBlocked = module.InputBlocked;
    }, function (module) {
      Update$1 = module.Update;
    }, function (module) {
      Blocked = module.Blocked;
      Update$4 = module.Update;
    }, function (module) {
      Update$3 = module.Update;
    }, function (module) {
      ShowChoice = module.ShowChoice;
      ShowDetail = module.ShowDetail;
    }, function (module) {
      Update$2 = module.Update;
    }, function (module) {
      Result = module.Result;
    }, function (module) {
      Start = module.Start;
      Update$7 = module.Update;
    }, function (module) {
      Pause = module.Pause;
    }, function (module) {
      pauseAudio = module.pauseAudio;
      resumeAudio = module.resumeAudio;
      setMusic = module.setMusic;
      playCue = module.playCue;
    }],
    execute: function () {
      exports({
        Update: Update,
        install: install,
        newGame: newGame
      });
      cclegacy._RF.push({}, "baeaeArR7VNp60Wp431+mM6", "game", undefined);
      // A cat's skill clip starts at once, its paw trail leaves at the clip's release frame and the result lands 0.35 s
      // later; the run (and so the countdown) holds from the wind-up until the result lands - presentation only.
      var PAW_TRAVEL = .35;
      var CHAIN_ZERO = function CHAIN_ZERO() {
        return L('本串得分 0');
      };
      function newGame(run, previousBest) {
        return {
          run: run,
          tiles: [],
          cellSize: 298 / SIZE,
          playWidth: 360,
          resumeDelay: 0,
          boardEvents: [],
          boardLag: 0,
          boardBusyUntil: 0,
          renderingBoardEvent: false,
          assistTiming: new Map(),
          cellPaints: [],
          popping: {},
          vfxTime: 0,
          vfxBatches: [],
          vfxSlotWaves: {},
          cellVfx: {},
          landIn: 0,
          invalidLeft: 0,
          transitionLeft: 0,
          settleLeft: 0,
          feedbackTime: 0,
          lastChainFeedback: CHAIN_ZERO(),
          timeCaptionLeft: 0,
          closingShown: false,
          delayedCues: [],
          newRecord: false,
          previousBest: previousBest
        };
      }
      function install(app) {
        app.NewGame = function () {
          // Ignore repeated taps while the run id is saved; do not start if the player navigated away.
          if (app.profile.loadError || app.profile.busy || app.starting) return;
          // Web portals: the break before a run (the portal may show an ad), audio muted, repeated taps ignored.
          var pause = app.commercialBreak;
          if (pause) {
            app.starting = true;
            pauseAudio('break');
            pause()["catch"](function () {
              return undefined;
            }).then(function () {
              resumeAudio('break');
              app.starting = false;
              startRun();
            });
            return;
          }
          startRun();
        };
        var startRun = function startRun() {
          if (app.profile.loadError || app.profile.busy || app.starting) return;
          app.starting = true;
          var origin = app.screen;
          var _app$profile$NewRunId = app.profile.NewRunId(),
            id = _app$profile$NewRunId[0],
            err = _app$profile$NewRunId[1];
          app.starting = false;
          if (app.screen !== origin) return;
          if (id === null) {
            app.refs.onStartReset == null || app.refs.onStartReset();
            app.Toast(String(err));
            return;
          }
          var levels = {};
          for (var _i = 0, _Object$entries = Object.entries(app.profile.cats); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _Object$entries[_i],
              cat = _Object$entries$_i[0],
              data = _Object$entries$_i[1];
            levels[cat] = data.level;
          }
          var run = new Run(Math.floor(Date.now() / 1000) + id * 7919, app.profile.equipped, levels);
          run.id = id;
          app.g = newGame(run, app.profile.best);
          Begin(app);
          setMusic('music.play');
          Start(app);
        };
        app.Game = function () {
          var g = app.g;
          Clear();
          g.tiles = [];
          g.countdown = undefined;
          g.boardEvents = [];
          g.boardLag = 0;
          g.boardBusyUntil = 0;
          g.renderingBoardEvent = false;
          g.skillHoldUntil = undefined;
          g.assistTiming = new Map();
          g.presentation = new Presentation(g.run.Snapshot());
          Build(app, {
            PointerDown: function PointerDown(e) {
              return pointerDown(app, e);
            },
            PointerMove: function PointerMove(e) {
              return pointerMove(app, e);
            },
            PointerUp: function PointerUp(e) {
              return pointerUp(app, e);
            },
            Cancel: function Cancel() {
              g.drag = undefined;
            }
          });
          Build$1(app);
          paintBoard(app, g.run.board);
          g.shownSnapshot = g.run.Snapshot();
          app.RefreshHUD();
        };
        app.Events = function () {
          return events(app);
        };
        app.RefreshHUD = function () {
          if (app.screen === 'game') Refresh(app);
        };
        app.SetCellArt = function (r, c, cell) {
          return setCellArt(app, r, c, cell);
        };
        app.Upgrades = function () {
          return ShowChoice(app);
        };
        app.Result = function () {
          return Result(app);
        };
        // Only from the live play page (an item tapped under the gift choice or the pause card must not replace them).
        app.ShowItemDetail = function (id) {
          var u = Upgrade(id);
          if (u && app.screen === 'game') ShowDetail(app, u);
        };
        app.Pause = function () {
          if (Blocked(app) || Blocked$1(app)) return;
          if (app.screen !== 'game' && app.screen !== 'pause') return;
          Pause(app);
        };
        app.EndRun = function () {
          var g = app.g;
          var guard = 0;
          while (g.run.phase !== 'idle' && g.run.phase !== 'upgrade' && g.run.phase !== 'finished' && guard < 1000) {
            g.run.Update(.3);
            g.run.DrainEvents();
            guard++;
          }
          if (guard >= 1000) {
            app.Toast('结算仍在进行，请继续游戏');
            return;
          }
          g.run.Finish(true);
          g.run.DrainEvents();
          app.Finish();
        };
        app.Finish = function () {
          var g = app.g;
          g.newRecord = g.run.score > g.previousBest;
          app.screen = 'result';
          g.settleError = undefined;
          var _app$profile$Settle = app.profile.Settle(g.run),
            ok = _app$profile$Settle[0],
            result = _app$profile$Settle[1];
          // Every settlement plays the wind chime; no separate new-record sound.
          if (ok) {
            g.settlement = result;
            playCue('sfx.celebrate');
          } else g.settleError = String(result);
          app.Result();
        };
      }

      // ---- board painting ---------------------------------------------------------------------------------------------
      function paintCell(app, r, c, cell) {
        var _tiles$r;
        var view = (_tiles$r = app.g.tiles[r]) == null ? void 0 : _tiles$r[c];
        if (!view) return;
        // A finished fillMode both animation keeps its last values: clear them before the next one.
        view.panel.StopAnimation();
        view.panel.SetStyle({
          translateX: 0,
          translateY: 0,
          scale: 1,
          opacity: cell ? 1 : 0
        });
        setCellArt(app, r, c, cell);
      }
      function setCellArt(app, r, c, cell) {
        var _g$tiles$r, _names, _cell$special;
        var g = app.g;
        var view = (_g$tiles$r = g.tiles[r]) == null ? void 0 : _g$tiles$r[c];
        if (!view || !cell) return;
        var good = goods[cell.kind - 1];
        var asset = resolveAsset('ui.r02.tile.' + good.id);
        var selected = g.selected && g.selected.r === r && g.selected.c === c;
        view.panel.SetStyle({
          backgroundColor: asset ? [0, 0, 0, 0] : [good.color[0], good.color[1], good.color[2], 255],
          borderWidth: selected ? 3 : 0,
          borderColor: selected ? colors.ink : [255, 255, 255, 170]
        });
        var line = cell.special === 'row' || cell.special === 'column',
          bomb = cell.special === 'bomb',
          rainbow = cell.special === 'rainbow';
        var special = cell.special && !bomb ? resolveAsset('ui.r02.special.' + cell.special + (line ? '.overlay' : '')) : undefined;
        var bombAsset = bomb ? resolveAsset('ui.r02.special.bomb.' + good.id) : undefined;
        var display = bombAsset != null ? bombAsset : asset;
        view.image.SetStyle({
          backgroundImage: display ? display.path : null,
          opacity: display ? rainbow && special ? 0 : 1 : 0,
          scale: line ? .62 : 1
        });
        view.text.SetText(display ? '' : good.symbol);
        view.badge.SetStyle({
          backgroundImage: asset ? asset.path : null,
          opacity: rainbow && special && asset ? 1 : 0
        });
        view.overlay.SetStyle({
          backgroundImage: special ? special.path : null,
          opacity: special ? 1 : 0
        });
        var names = {
          row: '↔',
          column: '↕',
          bomb: '✦',
          rainbow: '★'
        };
        view.mark.SetText(!(special || bombAsset) ? (_names = names[(_cell$special = cell.special) != null ? _cell$special : '']) != null ? _names : '' : '');
      }
      function paintBoard(app, board) {
        var g = app.g;
        // Only the ordered board-event renderer may replace a board whose delayed fall is still on screen.
        if (g.boardEvents.length > 0 && !g.renderingBoardEvent) return;
        g.cellPaints = [];
        // A cell still popping in with the same piece keeps its animation.
        for (var r = 1; r <= 7; r++) for (var c = 1; c <= 7; c++) {
          var p = g.popping[r * 8 + c];
          var cell = board[r][c];
          var v = g.cellVfx[r * 8 + c];
          var same = v && cell && cell.uid === v.after.uid && cell.kind === v.after.kind && cell.special === v.after.special;
          if (v && !same) delete g.cellVfx[r * 8 + c];
          if (!same && !(p && app.clock < p.till && cell && cell.uid === p.uid && cell.special === p.special)) paintCell(app, r, c, cell);
        }
      }
      // Special creation (motion M02): cells whose special is new in `after`.
      function createdSpecials(before, after) {
        var out = [];
        for (var r = 1; r <= 7; r++) for (var c = 1; c <= 7; c++) {
          var a = after[r][c],
            b = before[r][c];
          if (a && a.special && (!b || b.uid !== a.uid || b.special !== a.special)) out.push({
            r: r,
            c: c,
            cell: a
          });
        }
        return out;
      }
      // The new special replaces its cell with a short pop: small -> slight overshoot -> rest.
      function popSpecial(app, r, c, cell) {
        var _g$tiles$r2;
        var g = app.g;
        paintCell(app, r, c, cell);
        g.popping[r * 8 + c] = {
          till: app.clock + .24,
          uid: cell.uid,
          special: cell.special
        };
        (_g$tiles$r2 = g.tiles[r]) == null || (_g$tiles$r2 = _g$tiles$r2[c]) == null || _g$tiles$r2.panel.Animate({
          keyframes: {
            0: {
              scale: .35,
              opacity: 0
            },
            .45: {
              scale: 1.18,
              opacity: 1
            },
            .75: {
              scale: .96,
              opacity: 1
            },
            1: {
              scale: 1,
              opacity: 1
            }
          },
          duration: .24,
          fillMode: 'both',
          easing: 'easeOut'
        });
      }
      function updateCellPaints(app) {
        var g = app.g;
        var keep = [];
        for (var _iterator = _createForOfIteratorHelperLoose(g.cellPaints), _step; !(_step = _iterator()).done;) {
          var p = _step.value;
          if (app.clock >= p.at) popSpecial(app, p.r, p.c, p.cell);else keep.push(p);
        }
        g.cellPaints = keep;
      }

      // ---- input -------------------------------------------------------------------------------------------------------
      function cellAt(app, e) {
        var size = app.g.cellSize;
        var c = Math.floor(e.x / size) + 1,
          r = Math.floor(e.y / size) + 1;
        return r >= 1 && r <= 7 && c >= 1 && c <= 7 ? [r, c] : undefined;
      }
      function boardInputBlocked(app) {
        var g = app.g;
        return Blocked(app) || InputBlocked(app) || app.screen !== 'game' || g.resumeDelay > 0 || g.invalidLeft > 0 || g.skillHoldUntil !== undefined;
      }
      function tryRainbowTap(app, r, c) {
        var g = app.g;
        if (boardInputBlocked(app) || !g.run.TapRainbow(r, c)) return false;
        g.selected = undefined;
        g.queued = undefined;
        events(app);
        return true;
      }
      function trySwap(app, r, c, rr, cc) {
        var g = app.g;
        if (boardInputBlocked(app)) return;
        if (g.run.phase === 'idle') {
          g.selected = undefined;
          g.run.Swap(r, c, rr, cc);
          events(app);
        } else if (g.run.phase === 'fall' && g.run.phaseRemaining <= .06) g.queued = [r, c, rr, cc, g.run.board[r][c].uid, g.run.board[rr][cc].uid];
      }
      function pointerDown(app, e) {
        var g = app.g;
        if (boardInputBlocked(app) || g.drag || !e.primary) return;
        var at = cellAt(app, e);
        if (!at) return;
        var r = at[0],
          c = at[1];
        var cell = g.run.board[r][c];
        g.drag = {
          r: r,
          c: c,
          x: e.x,
          y: e.y,
          id: e.id,
          moved: false,
          previous: g.selected,
          tapUid: g.run.phase === 'idle' && cell ? cell.uid : undefined
        };
        playCue('sfx.select');
        if (g.run.phase === 'idle') {
          g.selected = {
            r: r,
            c: c
          };
          paintBoard(app, g.run.board);
        }
      }
      function pointerMove(app, e) {
        var g = app.g;
        if (Blocked(app) || Blocked$1(app)) return;
        var d = g.drag;
        if (!d || d.id !== e.id || d.moved) return;
        var dx = e.x - d.x,
          dy = e.y - d.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < g.cellSize * .25) return;
        var rr = d.r,
          cc = d.c;
        if (Math.abs(dx) > Math.abs(dy)) cc += dx > 0 ? 1 : -1;else rr += dy > 0 ? 1 : -1;
        if (rr < 1 || rr > 7 || cc < 1 || cc > 7) return;
        d.moved = true;
        trySwap(app, d.r, d.c, rr, cc);
      }
      function pointerUp(app, e) {
        var g = app.g;
        if (Blocked(app) || Blocked$1(app)) return;
        var d = g.drag;
        if (!d || d.id !== e.id) return;
        g.drag = undefined;
        if (d.moved) return;
        var s = d.previous;
        if (s && Math.abs(s.r - d.r) + Math.abs(s.c - d.c) === 1) trySwap(app, s.r, s.c, d.r, d.c);else if (d.tapUid !== undefined) {
          var at = cellAt(app, e);
          var cell = g.run.board[d.r][d.c];
          if (at && at[0] === d.r && at[1] === d.c && cell && cell.uid === d.tapUid && cell.special === 'rainbow') tryRainbowTap(app, d.r, d.c);else if (g.run.phase === 'idle') {
            g.selected = {
              r: d.r,
              c: d.c
            };
            paintBoard(app, g.run.board);
          }
        } else if (g.run.phase === 'idle') {
          g.selected = {
            r: d.r,
            c: d.c
          };
          paintBoard(app, g.run.board);
        }
      }

      // ---- events --------------------------------------------------------------------------------------------------------
      function feedback(app, text) {
        var g = app.g;
        if (app.screen !== 'game') return;
        var refs = g.play;
        refs.feedback.SetText(text);
        // Pulse the line that is actually shown (scale only, so it never overrides opacity).
        var cc = g.lastChainCombo;
        var combo = cc && text === cc[0] + ' · ' + cc[1];
        var pulse = {
          keyframes: {
            0: {
              scale: .92
            },
            .25: {
              scale: 1.04
            },
            1: {
              scale: 1
            }
          },
          duration: .32
        };
        if (combo) {
          Refresh(app);
          refs.feedbackCombo.Animate(pulse);
        } else refs.feedback.Animate(pulse);
        g.feedbackTime = 2.6;
      }
      function clearBurst(app, cells) {
        var g = app.g;
        var stars = resolveAsset('fx.star');
        var _loop = function _loop() {
          var p = _step2.value;
          var burst = UI.Panel({
            position: 'absolute',
            left: (p.c - .5) * g.cellSize - 14,
            top: (p.r - .5) * g.cellSize - 14,
            width: 28,
            height: 28,
            backgroundImage: stars ? stars.path : null,
            backgroundFit: 'contain',
            pointerEvents: 'none'
          });
          g.play.board.AddChild(burst);
          burst.Animate({
            keyframes: {
              0: {
                scale: .3,
                opacity: 0
              },
              .28: {
                scale: .4,
                opacity: 0
              },
              .55: {
                scale: 1.1,
                opacity: 1
              },
              1: {
                scale: 1.6,
                opacity: 0,
                translateY: -14
              }
            },
            duration: .5,
            fillMode: 'both',
            onComplete: function onComplete() {
              return burst.Destroy();
            }
          });
        };
        for (var _iterator2 = _createForOfIteratorHelperLoose(cells.slice(0, 12)), _step2; !(_step2 = _iterator2()).done;) {
          _loop();
        }
      }
      function queueScreen(app, screen) {
        var g = app.g;
        g.pendingScreen = screen;
        g.transitionLeft = PRESENTATION.screen;
        // The settled board stays fully visible before the result fade.
        g.settleLeft = screen === 'result' ? PRESENTATION.settle : 0;
        g.drag = undefined;
        g.queued = undefined;
      }
      function events(app) {
        var _g$skillHoldUntil;
        var g = app.g;
        var list = g.run.DrainEvents();
        var cursor = 0,
          arrival = 0;
        for (var _iterator3 = _createForOfIteratorHelperLoose(list), _step3; !(_step3 = _iterator3()).done;) {
          var e = _step3.value;
          if (e.type === 'cat' && e.clip === 'assist' && e.context !== 'ending') {
            var release = cursor + Release(e.id);
            g.assistTiming.set(e, {
              start: cursor,
              release: release
            });
            arrival = release + PAW_TRAVEL;
            cursor = arrival;
          }
        }
        if (arrival > 0) g.skillHoldUntil = Math.max((_g$skillHoldUntil = g.skillHoldUntil) != null ? _g$skillHoldUntil : 0, g.vfxTime + arrival);
        // The order paper and score follow the delayed board result by the same margin as before.
        var cleared = list.some(function (e) {
          return e.type === 'clear';
        });
        g.presentation.Push(list, g.run.Snapshot(), arrival > 0 ? Math.max(0, arrival - (cleared ? PAW_TRAVEL : .15)) : 0);
        for (var _iterator4 = _createForOfIteratorHelperLoose(list), _step4; !(_step4 = _iterator4()).done;) {
          var _e = _step4.value;
          Event(app, _e);
          var timing = g.assistTiming.get(_e);
          if (timing) g.boardLag = timing.release + PAW_TRAVEL;
          // A partner's charge arc fills when 奶茶's paws reach it, like a board result.
          var boardEvent = ['swap', 'clear', 'fall', 'settled', 'invalid', 'shuffle', 'transform', 'cat_charge'].includes(_e.type);
          if (boardEvent && g.boardLag > 0) g.boardEvents.push({
            at: g.vfxTime + g.boardLag,
            event: _e
          });else renderEvent(app, _e);
        }
      }
      // Delay only board presentation; Run and the HUD presentation keep their clocks.
      function updateBoardEvents(app) {
        var g = app.g;
        while (g.boardEvents[0] && g.vfxTime + 1e-7 >= g.boardEvents[0].at) renderEvent(app, g.boardEvents.shift().event);
        if (g.boardEvents.length === 0 && g.run.phase === 'idle') g.boardLag = 0;
      }
      function renderEvent(app, e) {
        var g = app.g;
        var size = g.cellSize;
        g.renderingBoardEvent = true;
        var duration = e.duration;
        if (duration) g.boardBusyUntil = Math.max(g.boardBusyUntil, g.vfxTime + duration);
        var pos = function pos(v) {
          return v;
        };
        if (e.type === 'swap') {
          paintBoard(app, e.before);
          var from = pos(e.from),
            to = pos(e.to);
          var dx = (to.c - from.c) * size,
            dy = (to.r - from.r) * size;
          g.tiles[from.r][from.c].panel.Animate({
            keyframes: {
              0: {
                translateX: 0,
                translateY: 0
              },
              1: {
                translateX: dx,
                translateY: dy
              }
            },
            duration: duration,
            fillMode: 'both',
            easing: 'easeOut'
          });
          g.tiles[to.r][to.c].panel.Animate({
            keyframes: {
              0: {
                translateX: 0,
                translateY: 0
              },
              1: {
                translateX: -dx,
                translateY: -dy
              }
            },
            duration: duration,
            fillMode: 'both',
            easing: 'easeOut'
          });
          playCue('sfx.swap');
        } else if (e.type === 'clear') {
          var _ref;
          var cells = e.cells;
          // A later same-frame skill can consume a freshly generated block. Its real clear wins over a pending pop.
          for (var _iterator5 = _createForOfIteratorHelperLoose(cells), _step5; !(_step5 = _iterator5()).done;) {
            var p = _step5.value;
            delete g.cellVfx[p.r * 8 + p.c];
          }
          paintBoard(app, e.before);
          // Goods connected to a newly created special gather into its cell, which turns into the special halfway.
          var cleared = {},
            toward = {},
            hold = {};
          for (var _iterator6 = _createForOfIteratorHelperLoose(cells), _step6; !(_step6 = _iterator6()).done;) {
            var _p = _step6.value;
            cleared[_p.r * 10 + _p.c] = _p;
          }
          for (var _iterator7 = _createForOfIteratorHelperLoose(createdSpecials(e.before, e.after)), _step7; !(_step7 = _iterator7()).done;) {
            var _origin$cell, _seen;
            var made = _step7.value;
            var origin = cleared[made.r * 10 + made.c];
            if (!origin) continue;
            hold[made.r * 10 + made.c] = true;
            var kind = (_origin$cell = origin.cell) == null ? void 0 : _origin$cell.kind;
            var queue = [{
              r: made.r,
              c: made.c
            }];
            var seen = (_seen = {}, _seen[made.r * 10 + made.c] = true, _seen);
            while (queue.length > 0) {
              var q = queue.shift();
              for (var _i3 = 0, _arr2 = [[1, 0], [-1, 0], [0, 1], [0, -1]]; _i3 < _arr2.length; _i3++) {
                var d = _arr2[_i3];
                var k = (q.r + d[0]) * 10 + q.c + d[1];
                var n = cleared[k];
                if (n && !seen[k] && n.cell && n.cell.kind === kind) {
                  seen[k] = true;
                  toward[k] = {
                    dx: (made.c - n.c) * size,
                    dy: (made.r - n.r) * size
                  };
                  queue.push({
                    r: n.r,
                    c: n.c
                  });
                }
              }
            }
            g.cellPaints.push({
              at: app.clock + duration * .5,
              r: made.r,
              c: made.c,
              cell: made.cell
            });
          }
          for (var _iterator8 = _createForOfIteratorHelperLoose(cells), _step8; !(_step8 = _iterator8()).done;) {
            var _p2 = _step8.value;
            var _k = _p2.r * 10 + _p2.c,
              panel = g.tiles[_p2.r][_p2.c].panel,
              v = toward[_k];
            if (hold[_k]) panel.Animate({
              keyframes: {
                0: {
                  scale: 1,
                  opacity: 1
                },
                .4: {
                  scale: 1.12,
                  opacity: 1
                },
                1: {
                  scale: 1.12,
                  opacity: 1
                }
              },
              duration: duration * .5,
              fillMode: 'both'
            });else if (v) panel.Animate({
              keyframes: {
                0: {
                  scale: 1,
                  opacity: 1,
                  translateX: 0,
                  translateY: 0
                },
                .25: {
                  scale: 1.1,
                  opacity: 1,
                  translateX: 0,
                  translateY: 0
                },
                .5: {
                  scale: .55,
                  opacity: .9,
                  translateX: v.dx,
                  translateY: v.dy
                },
                .56: {
                  scale: .45,
                  opacity: 0,
                  translateX: v.dx,
                  translateY: v.dy
                },
                1: {
                  scale: .45,
                  opacity: 0,
                  translateX: v.dx,
                  translateY: v.dy
                }
              },
              duration: duration,
              fillMode: 'both',
              easing: 'easeIn'
            });else panel.Animate({
              keyframes: {
                0: {
                  scale: 1,
                  opacity: 1
                },
                .25: {
                  scale: 1.14,
                  opacity: 1
                },
                .42: {
                  scale: 1.14,
                  opacity: 1
                },
                .86: {
                  scale: .15,
                  opacity: 0
                },
                1: {
                  scale: .15,
                  opacity: 0
                }
              },
              duration: duration,
              fillMode: 'both'
            });
          }
          clearBurst(app, cells);
          Clear$1(app, e);
          var cascade = e.cascade;
          playCue(cascade > 1 ? 'sfx.combo' + Math.min(3, cascade - 1) : 'sfx.clear');
          // The HUD shows a cascade as two parts (large combo + score pill).
          var chain = L('本串 +{0}分', Math.floor((_ref = e.chainScore) != null ? _ref : e.score));
          g.lastChainCombo = cascade > 1 ? [L('{0}连消', cascade), chain] : undefined;
          g.lastChainFeedback = g.lastChainCombo ? g.lastChainCombo[0] + ' · ' + chain : chain;
          feedback(app, g.lastChainFeedback);
          var cue;
          for (var _i2 = 0, _arr = (_e$specials = e.specials) != null ? _e$specials : []; _i2 < _arr.length; _i2++) {
            var _e$specials, _cue;
            var effect = _arr[_i2];
            cue = effect.kind === 'bomb' ? 'bomb' : effect.kind === 'rainbow' ? 'rainbow' : (_cue = cue) != null ? _cue : 'line';
          }
          if (cue) playCue('sfx.' + cue);
        } else if (e.type === 'fall') {
          var _e$itemVfx;
          paintBoard(app, e.after);
          // Every keyframe carries full opacity and scale: the clear left these panels at opacity 0 / scale .15.
          for (var _i4 = 0, _arr3 = e.moves; _i4 < _arr3.length; _i4++) {
            var m = _arr3[_i4];
            g.tiles[m.toRow][m.col].panel.Animate({
              keyframes: {
                0: {
                  translateY: (m.fromRow - m.toRow) * size,
                  opacity: 1,
                  scale: 1
                },
                .74: {
                  translateY: 3,
                  opacity: 1,
                  scale: 1
                },
                .90: {
                  translateY: 0,
                  opacity: 1,
                  scale: 1
                },
                1: {
                  translateY: 0,
                  opacity: 1,
                  scale: 1
                }
              },
              duration: duration,
              fillMode: 'both',
              easing: 'easeOut'
            });
          }
          g.landIn = duration;
          var itemVfx = (_e$itemVfx = e.itemVfx) != null ? _e$itemVfx : [];
          Items(app, itemVfx);
          for (var _iterator9 = _createForOfIteratorHelperLoose(itemVfx), _step9; !(_step9 = _iterator9()).done;) {
            var b = _step9.value;
            for (var _iterator10 = _createForOfIteratorHelperLoose((_b$targets = b.targets) != null ? _b$targets : []), _step10; !(_step10 = _iterator10()).done;) {
              var _b$targets;
              var _p3 = _step10.value;
              Cell(app, _p3, .2);
            }
          }
        } else if (e.type === 'invalid') {
          playCue('sfx.invalid');
          paintBoard(app, g.run.board);
          var a = pos(e.from),
            _b = pos(e.to);
          if (a.r >= 1 && a.r <= 7 && a.c >= 1 && a.c <= 7 && _b.r >= 1 && _b.r <= 7 && _b.c >= 1 && _b.c <= 7 && Math.abs(a.r - _b.r) + Math.abs(a.c - _b.c) === 1) {
            g.invalidLeft = .22;
            var _dx = (_b.c - a.c) * size,
              _dy = (_b.r - a.r) * size;
            for (var _i5 = 0, _arr4 = [[a, 1], [_b, -1]]; _i5 < _arr4.length; _i5++) {
              var _arr4$_i = _arr4[_i5],
                _p4 = _arr4$_i[0],
                _k2 = _arr4$_i[1];
              g.tiles[_p4.r][_p4.c].panel.Animate({
                keyframes: {
                  0: {
                    translateX: 0,
                    translateY: 0
                  },
                  .45: {
                    translateX: _dx * _k2,
                    translateY: _dy * _k2
                  },
                  1: {
                    translateX: 0,
                    translateY: 0
                  }
                },
                duration: .22,
                easing: 'easeInOut',
                fillMode: 'both'
              });
            }
          }
        } else if (e.type === 'settled') paintBoard(app, e.after);else if (e.type === 'shuffle') {
          paintBoard(app, e.after);
          app.Toast('重新整理货架，不扣时间');
        } else if (e.type === 'transform') {
          paintBoard(app, e.after);
          var targets = e.targets;
          if (targets) {
            for (var _iterator11 = _createForOfIteratorHelperLoose(targets), _step11; !(_step11 = _iterator11()).done;) {
              var _p5 = _step11.value;
              Cell(app, _p5, 0);
            }
          } else {
            for (var _iterator12 = _createForOfIteratorHelperLoose(createdSpecials(e.before, e.after)), _step12; !(_step12 = _iterator12()).done;) {
              var _m = _step12.value;
              popSpecial(app, _m.r, _m.c, _m.cell);
            }
          }
        } else if (e.type === 'item_vfx') {
          var _itemVfx = e.itemVfx;
          Items(app, _itemVfx);
          for (var _iterator13 = _createForOfIteratorHelperLoose(_itemVfx), _step13; !(_step13 = _iterator13()).done;) {
            var _b2 = _step13.value;
            for (var _iterator14 = _createForOfIteratorHelperLoose((_b2$targets = _b2.targets) != null ? _b2$targets : []), _step14; !(_step14 = _iterator14()).done;) {
              var _b2$targets;
              var _p6 = _step14.value;
              Cell(app, _p6, .2);
            }
          }
        } else if (e.type === 'cat_charge') {
          for (var _iterator15 = _createForOfIteratorHelperLoose(g.play.catStates), _step15; !(_step15 = _iterator15()).done;) {
            var state = _step15.value;
            if (state.cat && state.cat.id === e.id) {
              state.charge.SetValue(e.after / e.need);
              console.log("[VFX] charge partner=" + e.id + " amount=" + e.amount);
            }
          }
        } else if (e.type === 'build') app.Toast(e.text);else if (e.type === 'cat') {
          var _g$assistTiming$get;
          var timing = (_g$assistTiming$get = g.assistTiming.get(e)) != null ? _g$assistTiming$get : {
            start: 0,
            release: 0
          };
          if (e.context !== 'ending') Play(e.id, e.clip, e.context, timing.start);
          if (e.clip === 'assist') {
            var _catPlaceholders;
            Skill(app, e, timing.release);
            // Each cat's own call at its release frame; a second call within 0.4 s waits 0.45 s after the first.
            var at = app.clock + Math.max(.12, timing.release);
            var chained = g.lastAssistCueAt !== undefined && Math.abs(at - g.lastAssistCueAt) < .4;
            if (chained) at = g.lastAssistCueAt + .45;else g.lastAssistCueAt = at;
            g.delayedCues.push({
              at: at,
              id: 'sfx.' + e.id
            });
            // The shared skill sound when the paws land, after the call.
            g.delayedCues.push({
              at: at + PAW_TRAVEL,
              id: 'sfx.skill'
            });
            (_catPlaceholders = g.play.catPlaceholders[e.id]) == null || _catPlaceholders.Animate({
              keyframes: {
                0: {
                  scale: 1
                },
                .35: {
                  scale: 1.08
                },
                1: {
                  scale: 1
                }
              },
              duration: .35
            });
            // Both names when two cats fire together.
            if (app.screen === 'game') {
              if (chained && g.lastAssistCat && g.lastAssistCat !== e.id) app.Toast(L('{0}和{1}来帮忙啦！', L(Cat(g.lastAssistCat).name), L(Cat(e.id).name)));else app.Toast(L('{0}来帮忙啦！', L(Cat(e.id).name)));
            }
            g.lastAssistCat = e.id;
          }
        } else if (e.type === 'upgrade') queueScreen(app, 'upgrade');else if (e.type === 'finished') queueScreen(app, 'result');
        g.renderingBoardEvent = false;
      }
      function updateDisplay(app, dt) {
        var g = app.g;
        var pres = g.presentation;
        pres.Update(dt);
        g.shownSnapshot = pres.snapshot;
        for (var _iterator16 = _createForOfIteratorHelperLoose(pres.DrainEvents()), _step16; !(_step16 = _iterator16()).done;) {
          var e = _step16.value;
          if (e.type === 'time') {
            var total = 0;
            for (var _iterator17 = _createForOfIteratorHelperLoose(e.sources), _step17; !(_step17 = _iterator17()).done;) {
              var _e$amounts$source;
              var source = _step17.value;
              total += (_e$amounts$source = e.amounts[source]) != null ? _e$amounts$source : 0;
            }
            g.timeCaption = L('+{0}秒', total.toFixed(1));
            g.timeCaptionLeft = 1.6;
            // Order time arrives with the seal and its order announcement, so it adds no separate time chime.
            var orderOnly = e.sources.length === 1 && e.sources[0] === '交单';
            Time(app, e);
            if (!orderOnly) playCue('sfx.time');
          } else if (e.type === 'receipt_sealed') {
            Order(app, e.receipt.count, e.receipt.bonus, e.receipt.firstIndex);
            playCue('sfx.order');
          } else if (e.type === 'receipt_merge') UpdateOrder(app, e.receipt);
        }
        g.timeCaptionLeft = Math.max(0, g.timeCaptionLeft - dt);
      }

      // Per-frame part of App.Update for a run (called by the app ticker before the shared parts).
      function Update(app, dt) {
        Update$1(dt);
        Update$2(app);
        Update$3(app);
        Update$4(app, dt);
        if (Blocked(app)) return;
        var g = app.g;
        if (!g) return;
        Update$5(app);
        if (Blocked$1(app)) return;
        if (app.detailClosing && app.clock >= app.detailClosing.removeAt) app.detailClosing.remove();
        for (var i = g.delayedCues.length - 1; i >= 0; i--) {
          var c = g.delayedCues[i];
          if (app.clock >= c.at) {
            g.delayedCues.splice(i, 1);
            playCue(c.id);
          }
        }
        g.invalidLeft = Math.max(0, g.invalidLeft - dt);
        if (app.screen === 'game') {
          Update$6(app, dt);
          updateBoardEvents(app);
          updateCellPaints(app);
          Update$7(app, dt);
          if (g.landIn > 0) {
            g.landIn -= dt;
            if (g.landIn <= 0) {
              var clearSoon = false;
              for (var _iterator18 = _createForOfIteratorHelperLoose(g.boardEvents), _step18; !(_step18 = _iterator18()).done;) {
                var pending = _step18.value;
                if (pending.at - g.vfxTime > .1) break;
                if (pending.event.type === 'clear') {
                  clearSoon = true;
                  break;
                }
              }
              if (!clearSoon) playCue('sfx.land');
            }
          }
          updateDisplay(app, dt);
          if (g.pendingScreen && g.boardEvents.length === 0 && g.vfxTime >= g.boardBusyUntil && !g.presentation.Busy() && !(g.pendingScreen === 'upgrade' && Waiting(app)) && !(g.skillHoldUntil !== undefined && g.vfxTime + 1e-7 < g.skillHoldUntil)) {
            g.play.feedback.SetText(g.pendingScreen === 'upgrade' ? L('顾客送来谢礼 · 选择本局道具') : L('本局收益已计入 · 正在结算'));
            if (g.settleLeft > 0) {
              if (g.presentation.Settled()) g.settleLeft -= dt;
            } else g.transitionLeft -= dt;
            // The choice overlay dims the play page itself; only the result page fades the play page out.
            if (g.pendingScreen !== 'upgrade') app.page.SetStyle({
              opacity: Math.max(0, g.transitionLeft / PRESENTATION.screen)
            });
            if (g.transitionLeft <= 0) {
              var target = g.pendingScreen;
              g.pendingScreen = undefined;
              if (target === 'upgrade') app.Upgrades();else app.Finish();
            }
          }
        }
        if (g.feedbackTime > 0) {
          g.feedbackTime -= dt;
          // While a screen is pending the bar keeps its transition text.
          if (g.feedbackTime <= 0 && app.screen === 'game' && !g.pendingScreen) g.play.feedback.SetText(g.lastChainFeedback);
        }
        if (app.screen === 'game') {
          if (g.resumeDelay > 0) g.resumeDelay = Math.max(0, g.resumeDelay - dt);else if (g.skillHoldUntil !== undefined && g.vfxTime + 1e-7 < g.skillHoldUntil) ;else {
            if (g.skillHoldUntil !== undefined) {
              g.skillHoldUntil = undefined;
              if (g.boardEvents.length === 0) g.boardLag = 0;
            }
            g.run.Update(dt);
            events(app);
            if (g.run.elapsed >= RECOVERY_FADE_END && !g.closingShown) {
              g.closingShown = true;
              feedback(app, L('最后 30 秒 · 加时结束，冲刺得分！'));
            }
            if (app.screen === 'game' && g.run.phase === 'idle' && g.queued) {
              var _g$run$board$q$0$q$, _g$run$board$q$2$q$;
              var q = g.queued;
              g.queued = undefined;
              if (((_g$run$board$q$0$q$ = g.run.board[q[0]][q[1]]) == null ? void 0 : _g$run$board$q$0$q$.uid) === q[4] && ((_g$run$board$q$2$q$ = g.run.board[q[2]][q[3]]) == null ? void 0 : _g$run$board$q$2$q$.uid) === q[5]) trySwap(app, q[0], q[1], q[2], q[3]);
            }
          }
          app.RefreshHUD();
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gameState.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dda0aEbUnBAd6VBA8gx6i9v", "gameState", undefined); // State of a run on screen (the play-related fields of the Maker repo scripts/Game/App.lua), kept apart from AppState
      // so the page modules can share one typed object: app.g.
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/handbook.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './skin.ts', './paper.ts', './config.ts', './i18n.ts', './text.ts', './itemTags.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, UI, PT, Image, Face, Text, ink, warmRed, Block, TwoLines, Paper, Button, INITIAL_TIME, MAX_TIME, SESSION_LIMIT, RECOVERY_FADE_END, UPGRADE_FIRST_ORDERS, UpgradeSlotCap, REROLL_BASE, REROLL_AD_AMOUNT, REROLL_AD_DAILY_CAP, SkillText, Cat, SCORE_REWARD_DAILY_CAP, DAILY_BONUS, AD_BONUS_FLOOR, AD_BONUS_STEPS, RELEASE_CAT_IDS, ORDER_TIME, Upgrade, SkillIcon, L, language, phraseLines, blockLines, fitSize, TagRow, Tags, TagWords;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
      PT = module.PT;
    }, function (module) {
      Image = module.Image;
      Face = module.Face;
      Text = module.Text;
      ink = module.ink;
      warmRed = module.warmRed;
      Block = module.Block;
      TwoLines = module.TwoLines;
    }, function (module) {
      Paper = module.Paper;
      Button = module.Button;
    }, function (module) {
      INITIAL_TIME = module.INITIAL_TIME;
      MAX_TIME = module.MAX_TIME;
      SESSION_LIMIT = module.SESSION_LIMIT;
      RECOVERY_FADE_END = module.RECOVERY_FADE_END;
      UPGRADE_FIRST_ORDERS = module.UPGRADE_FIRST_ORDERS;
      UpgradeSlotCap = module.UpgradeSlotCap;
      REROLL_BASE = module.REROLL_BASE;
      REROLL_AD_AMOUNT = module.REROLL_AD_AMOUNT;
      REROLL_AD_DAILY_CAP = module.REROLL_AD_DAILY_CAP;
      SkillText = module.SkillText;
      Cat = module.Cat;
      SCORE_REWARD_DAILY_CAP = module.SCORE_REWARD_DAILY_CAP;
      DAILY_BONUS = module.DAILY_BONUS;
      AD_BONUS_FLOOR = module.AD_BONUS_FLOOR;
      AD_BONUS_STEPS = module.AD_BONUS_STEPS;
      RELEASE_CAT_IDS = module.RELEASE_CAT_IDS;
      ORDER_TIME = module.ORDER_TIME;
      Upgrade = module.Upgrade;
      SkillIcon = module.SkillIcon;
    }, function (module) {
      L = module.L;
      language = module.language;
    }, function (module) {
      phraseLines = module.phraseLines;
      blockLines = module.blockLines;
      fitSize = module.fitSize;
    }, function (module) {
      TagRow = module.TagRow;
      Tags = module.Tags;
      TagWords = module.TagWords;
    }],
    execute: function () {
      exports({
        Close: Close,
        Content: Content,
        Open: Open,
        Render: Render,
        Select: Select
      });
      cclegacy._RF.push({}, "44f1aghOWZDirNTmfn0sLQY", "handbook", undefined);
      // Chinese and Japanese list with 、, the others with a comma.
      function listSeparator() {
        var l = language();
        return l === 'zh_CN' || l === 'zh_TW' || l === 'ja' ? '、' : ', ';
      }
      var ZW = '​';

      // Full sentences that read like explaining the rules to a friend; numbers come from Config.
      function Content(index, cats) {
        if (index === 1) return [L('消除'), L('消除与订单'), [L('把相邻的两件商品交换位置，让三件一样的商品连成一排，它们就会被消除。'), L('每消除一件商品都会得分，这些分会装进顾客的订单。订单上画着两种偏好品，消除偏好品得的分是平常的两倍。'), L('订单的分数装满，就会自动交单，同时给你加一点营业时间，然后换下一位顾客。'), L('商品消除后，上面的商品会落下来补位。落下来如果又凑成一排，就会接着消除，这叫连消。连得越多，每次得的分越高。')]];
        if (index === 2) return [L('特殊块'), L('特殊块'), [L('四件一样的商品连成一排时，会留下一个线消。横着连出来的线消，发动时清掉它所在的那一整行；竖着连出来的，清掉那一整列。'), L('五件或更多一样的商品连成一排时，会留下一个彩色毛线团。点一下毛线团，场上所有和订单第一种偏好品一样的商品都会被清掉；把它和旁边的商品交换，就清掉场上所有和那件商品一样的商品。'), L('横着一排和竖着一排一样的商品，在同一件商品上交叉时，也就是摆成 T 字形或 L 字形，会留下一枚炸弹。最少要 5 件：横着 3 件、竖着 3 件，共用交叉的那一件。这时不会再出线消。炸弹发动时，会把它周围 3×3 的商品一起炸掉。'), L('交叉的两排里，如果有一排达到 5 件，这一排照样会留下彩色毛线团，交叉的地方再多留一枚炸弹；两排都达到 5 件，就各留一个彩色毛线团。两个特殊块正好落在同一格时，只留下彩色毛线团。'), L('线消和炸弹仍然算它原来那种商品，和同样的商品连成一排被消除时，就会发动。它们被别的特殊块炸到或清到时，也会跟着发动，所以一个特殊块常常会接着引发下一个。')]];
        if (index === 3) return [L('加时'), L('营业与加时'), [L('每局开始时有 {0} 秒倒计时，倒计时走到 0，小店就打烊。', INITIAL_TIME), L('每交一单，倒计时会多几秒。越到后面加得越少，倒计时最多攒到 {0} 秒。', MAX_TIME), L('不过一局最长只营业 {0} 秒，也就是 {1} 分钟。到了 {1} 分钟，就算倒计时还没走完，小店也会打烊。在最后 {2} 秒里交单，不再加时。', SESSION_LIMIT, Math.floor(SESSION_LIMIT / 60), SESSION_LIMIT - RECOVERY_FADE_END), L('暂停、挑道具和看手册的时候，倒计时不会走。')]];
        if (index === 4) return [L('道具'), L('道具与标签'), [L('交完第 {0} 单时，顾客会送来三件谢礼，你可以从里面挑一件道具带上。一局最多带 {1} 件道具。', UPGRADE_FIRST_ORDERS.slice(0, UpgradeSlotCap()).join(listSeparator()), UpgradeSlotCap()), L('每件道具带一到两个标签。同标签的道具搭在一起，效果往往更强。每件道具具体做什么，写在它的卡片上。'), L('不喜欢这三件谢礼，可以重抽换一组。每局有 {0} 次免费重抽；每有一只亲密等级到 Lv5 的猫上场，就多 1 次。', REROLL_BASE), L('挑谢礼时看一次广告，可以再多 {0} 次重抽。这种广告每天最多看 {1} 次，和结算时领积分的广告分开算。', REROLL_AD_AMOUNT, REROLL_AD_DAILY_CAP)]];
        if (index === 5) {
          var paragraphs = [L('每局最多带两只猫上场，两只猫互为搭档。'),
          // m1.6 (2026-10-15, user): no partner cats; items work on whatever the cats clear or place.
          L('你每次交换消除了几件商品，上场的猫就各攒几点能量，一次最多攒 12 点。能量攒满，猫就会自己出手帮忙。'), L('猫清掉的商品、放出来的炸弹和线消，都和你自己消除的一样，会触发道具效果。'), L('提升猫的亲密等级，它攒满能量会更快，帮忙的效果也更强。')];
          for (var _iterator = _createForOfIteratorHelperLoose(RELEASE_CAT_IDS), _step; !(_step = _iterator()).done;) {
            var _cats$id$level, _cats$id;
            var id = _step.value;
            var level = (_cats$id$level = cats == null || (_cats$id = cats[id]) == null ? void 0 : _cats$id.level) != null ? _cats$id$level : 1;
            var skill = SkillText(id, level).split('\n').join(ZW);
            paragraphs.push(L('{0} Lv{1}：' + ZW + '{2}', L(Cat(id).name), level, skill));
          }
          return [L('猫咪'), L('猫咪帮忙'), paragraphs];
        }
        return [L('积分'), L('成绩与养猫积分'), [L('每局结束时，这局的成绩会换成养猫积分。成绩越高，换到的积分越多，不过有上限。每天只有前 {0} 局能换积分。', SCORE_REWARD_DAILY_CAP), L('每天第一次完成结算，会额外送你 {0} 养猫积分。', DAILY_BONUS), L('养猫积分可以用来领养新猫，也可以提升猫的亲密等级。'), L('结算时还可以看广告，再领一次这局的积分。当天第 1 次能领 2 倍' + ZW + '（至少 {0}），' + ZW + '第 2 次领 1 倍' + ZW + '（至少 {1}），' + ZW + '第 3 次领一半' + ZW + '（至少 {2}）。', Math.floor(AD_BONUS_FLOOR * AD_BONUS_STEPS[0]), Math.floor(AD_BONUS_FLOOR * AD_BONUS_STEPS[1]), Math.floor(AD_BONUS_FLOOR * AD_BONUS_STEPS[2]))]];
      }
      function Close(app) {
        var state = app.handbook;
        if (!state) return;
        state.overlay.Destroy();
        app.screen = state.origin;
        app.handbook = undefined;
      }
      function Select(app, index) {
        if (!app.handbook || !Number.isInteger(index) || index < 1 || index > 6) return false;
        app.handbook.index = index;
        Render(app);
        return true;
      }
      function Open(app) {
        if (app.handbook || app.screen !== 'home' && app.screen !== 'pause' || !app.page) return false;
        // The overlay swallows touches so the page underneath stays inert.
        var overlay = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundColor: [47, 32, 20, 110],
          onClick: function onClick() {}
        });
        app.handbook = {
          index: 1,
          origin: app.screen,
          overlay: overlay
        };
        app.screen = 'handbook';
        app.page.AddChild(overlay);
        Render(app);
        return true;
      }
      function example(book, index) {
        var frame = Paper('ui.rules.example_frame', 276, 164);
        frame.SetStyle({
          position: 'absolute',
          left: 22,
          top: 208,
          width: 276,
          height: 164
        });
        book.AddChild(frame);
        var art = function art(id, x, y, w, h) {
          return frame.AddChild(Image(id, x, y, w, h != null ? h : w));
        };
        if (index === 1) {
          // Swap the highlighted bell up and fish down to complete the middle row.
          var goods = ['yarn', 'fish', 'feather', 'fish', 'cushion', 'fish', 'bell', 'fish', 'yarn', 'bell', 'cushion', 'feather', 'yarn', 'bell', 'feather'];
          goods.forEach(function (id, i) {
            var x = 25 + i % 5 * 46,
              y = 16 + Math.floor(i / 5) * 46;
            frame.AddChild(UI.Panel({
              position: 'absolute',
              left: x,
              top: y,
              width: 40,
              height: 40,
              borderRadius: 5,
              backgroundColor: [255, 248, 234, 255],
              pointerEvents: 'none'
            }));
            if (i === 1 || i === 6) art('ui.tips.glow_frame', x - 8, y - 8, 56);
            art('ui.r02.tile.' + id, x + 6, y + 6, 28);
          });
          // The source arrow points up; keep its 5:8 aspect in the gap between the two goods.
          art('ui.tips.swipe_arrow', 86, 52, 10, 16);
        } else if (index === 2) {
          ['row', 'column', 'bomb.fish', 'rainbow'].forEach(function (id, i) {
            return art('ui.r02.special.' + id, 28 + i * 58, 52, 46);
          });
        } else if (index === 3) {
          art('ui.icon.hourglass.r02', 53, 46, 60);
          frame.AddChild(Text(L('+{0} 秒', ORDER_TIME), 24, 123, 50, 126, 52, warmRed));
        } else if (index === 4) {
          // The example shows the tags; the middle item shares a tag with each neighbour.
          art('ui.play.item_shelf', 24, 100, 228, 40);
          // Capsules when every item's fit the 69-unit spacing; otherwise all three as the choice card's coloured words.
          var ids = ['bake_core', 'ribbon_measure', 'ribbon_spool'];
          var capsulesFit = ids.every(function (id) {
            var r = TagRow(Tags(Upgrade(id)), 9, 16, 80, 'center');
            r.row.Destroy();
            return r.width <= 66;
          });
          ids.forEach(function (id, i) {
            var x = 43 + i * 69;
            art('upgrade.' + id, x, 47, 52);
            var holder = UI.Panel({
              position: 'absolute',
              left: x + 26 - 40,
              top: 29,
              width: 80,
              height: 16,
              pointerEvents: 'none'
            });
            var tags = Tags(Upgrade(id));
            holder.AddChild(capsulesFit ? TagRow(tags, 9, 16, 80, 'center').row : TagWords(tags, 9, 16, 80));
            frame.AddChild(holder);
          });
        } else if (index === 5) {
          ['ragdoll', 'tuxedo'].forEach(function (id, i) {
            var x = 39 + i * 116;
            art('ui.cats.skill_medallion', x, 43, 65);
            art('ui.rules.avatar_' + id, x + 7.5, 50.5, 50);
            art('ui.cats.skill_medallion', x + 71, 78, 30);
            // Charge is a programmatic ring inside the approved medallion, not a new icon.
            frame.AddChild(UI.Panel({
              position: 'absolute',
              left: x + 76,
              top: 83,
              width: 20,
              height: 20,
              borderWidth: 3,
              borderColor: [128, 172, 84, 255],
              borderRadius: 10,
              pointerEvents: 'none'
            }));
            art(SkillIcon(id), x + 78, 85, 16);
          });
        } else {
          art('icon.points', 68, 24, 56);
          art('ui.icon.points_matatabi', 152, 24, 56);
          frame.AddChild(Text(L('成绩 → 积分'), 20, 24, 92, 228, 40, ink));
        }
      }

      // Height of the old non-scrolling body (S.Block rows at 1.3 line height plus .6 leading, 3-unit paragraph gaps).
      function fitBodySize(paragraphs, minimumSize) {
        if (minimumSize === void 0) {
          minimumSize = 9;
        }
        var size = 14;
        for (;;) {
          var height = 0;
          for (var _iterator2 = _createForOfIteratorHelperLoose(paragraphs), _step2; !(_step2 = _iterator2()).done;) {
            var value = _step2.value;
            var packed = phraseLines(value, size, 'body', 272);
            var r = blockLines(packed, size, 'body', 272);
            height += (r.lines.length * 1.3 + .6) * r.size * PT + 3;
          }
          if (height <= 112 || size <= minimumSize) return size;
          size = Math.max(minimumSize, size - .5);
        }
      }
      // Scrolling body: each S.Block contributes its .6-font leading, then the 3-unit paragraph gap; one flat row list.
      function spacedBody(paragraphs, size, lineHeight) {
        var body = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 258,
          height: 0,
          pointerEvents: 'none',
          overflow: 'visible'
        });
        var height = 0;
        var starts = [];
        paragraphs.forEach(function (value, i) {
          var packed = phraseLines(value, size, 'body', 258);
          var _S$Block = Block(packed, size, 0, 0, 258, ink, 'body', 'left', lineHeight),
            paragraph = _S$Block[0],
            bh = _S$Block[1];
          starts.push(body.children.length + 1);
          for (var _iterator3 = _createForOfIteratorHelperLoose(paragraph.children.slice()), _step3; !(_step3 = _iterator3()).done;) {
            var row = _step3.value;
            row.SetStyle({
              top: height + row.props.top
            });
            body.AddChild(row);
          }
          paragraph.Destroy();
          height += bh + (i < paragraphs.length - 1 ? 3 : 0);
        });
        body.SetStyle({
          height: height
        });
        return {
          body: body,
          height: height,
          starts: starts
        };
      }

      // Two centred lines for a tab caption and their size, as large as both fit (at most 13.5 pt); undefined when the
      // caption has no break point (a single Latin word).
      function twoLineFit(caption) {
        var lines = TwoLines(caption, 9, 'sans');
        if (!lines[1]) return undefined;
        var size = Math.min(13.5, 34 / (2 * PT * 1.05));
        for (var _iterator4 = _createForOfIteratorHelperLoose(lines), _step4; !(_step4 = _iterator4()).done;) {
          var line = _step4.value;
          size = Math.min(size, fitSize(line, 13.5, 'sans', 76 / .92));
        }
        return [lines, size];
      }
      // Replaces a plate button's one-line label with the two lines of twoLineFit.
      function twoLineCaption(tab, _ref) {
        var lines = _ref[0],
          size = _ref[1];
        tab.children[tab.children.length - 1].Destroy();
        var lh = size * PT * 1.05,
          top = (40 - lh * lines.length) / 2 - .6;
        lines.forEach(function (line, k) {
          return tab.AddChild(Text(line, size, 8, top + k * lh, 76, lh, ink, 'center', 'sans'));
        });
      }
      function Render(app) {
        var state = app.handbook;
        var overlay = state.overlay;
        overlay.ClearChildren();
        var book = UI.Panel({
          position: 'absolute',
          left: 20,
          top: 44,
          width: 320,
          height: 564
        });
        book.AddChild(Paper('ui.result.paper', 320, 564));
        overlay.AddChild(book);
        var title = UI.Panel({
          position: 'absolute',
          left: 60,
          top: -24,
          width: 200,
          height: 60
        });
        title.AddChild(Image('ui.pause.title_plaque', 0, 0, 200, 60));
        var _S$Face = Face('ui.pause.title_plaque', 0, 0, 200, 60),
          fx = _S$Face[0],
          fy = _S$Face[1],
          fw = _S$Face[2],
          fh = _S$Face[3];
        title.AddChild(Text(L('营业手册'), 18, fx, fy + fh / 2 - 20, fw, 40, ink));
        book.AddChild(title);
        var tabs = [];
        var _loop = function _loop(i) {
          var _Content2 = Content(i),
            caption = _Content2[0];
          // A caption that two lines show larger than one (English "Special pieces", Japanese 特殊ブロック) takes two lines.
          // Chinese captions fit one line near 18 pt and never do.
          var split = twoLineFit(caption);
          var twoLines = split !== undefined && split[1] > fitSize(caption, 18, 'sans', 76 / .92) + 1;
          var tab = Button(twoLines ? '' : caption, function () {
            return Select(app, i);
          }, 92, 40, i !== state.index, false, 18);
          if (twoLines) twoLineCaption(tab, split);
          // Keep the approved 40-high face; extend its transparent hit area to 44.
          tab.SetStyle({
            position: 'absolute',
            left: 16 + (i - 1) % 3 * 98,
            top: 50 + Math.floor((i - 1) / 3) * 50,
            width: 92,
            height: 44
          });
          book.AddChild(tab);
          tabs.push(tab);
        };
        for (var i = 1; i <= 6; i++) {
          _loop(i);
        }
        app.refs.handbookTabs = tabs;
        var _Content = Content(state.index, app.profile.cats),
          heading = _Content[1],
          paragraphs = _Content[2];
        book.AddChild(UI.Panel({
          position: 'absolute',
          left: 24,
          top: 156,
          width: 272,
          height: 1,
          backgroundColor: [202, 172, 133, 255],
          pointerEvents: 'none'
        }));
        book.AddChild(Text(heading, 23, 28, 166, 264, 36, ink, 'left'));
        example(book, state.index);
        // Every page uses the cat page's four paragraphs from before the 2026-10-26 rewrite as its sizing reference (never
        // rendered; measuring the full-sentence pages would shrink every page to the 9 pt floor).
        var reference = ['最多两只上场；' + ZW + '消除给猫充能，' + ZW + '充满自动帮忙', '猫清掉的商品、' + ZW + '放的炸弹和直线块，' + ZW + '道具一样算数',
        // i18n-ignore (sizing reference)
        '升亲密度' + ZW + '让技能更快更强', '团团 Lv1：' + ZW + '把 3 件商品' + ZW + '换成偏好品']; // i18n-ignore (sizing reference)
        var size = fitBodySize(reference);
        var lineHeight = 1.45;
        var _spacedBody = spacedBody(paragraphs, size, lineHeight),
          body = _spacedBody.body,
          height = _spacedBody.height,
          starts = _spacedBody.starts;
        var px = size * PT,
          step = lineHeight * px,
          leading = .6 * px;
        var visibleLines = Math.max(1, Math.floor((122 - leading) / step));
        var viewportHeight = visibleLines * step + leading;
        visibleLines = 0;
        // Sentence gaps make the row grid nonuniform: end the first view after a complete row, with S.Block's half leading.
        for (var _iterator5 = _createForOfIteratorHelperLoose(body.children), _step5; !(_step5 = _iterator5()).done;) {
          var row = _step5.value;
          var bottom = row.props.top + row.props.height + leading / 2;
          if (bottom > 122 + .01) break;
          viewportHeight = bottom;
          visibleLines++;
        }
        var rowTop = function rowTop(row) {
            return row.props.top;
          },
          rowH = function rowH(row) {
            return row.props.height;
          };
        var endOffset = Math.max(0, height - viewportHeight);
        var visibleBottomLines = body.children.filter(function (row) {
          return rowTop(row) >= endOffset - .01 && rowTop(row) + rowH(row) <= endOffset + viewportHeight + .01;
        }).length;
        var content = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 272,
          height: height,
          children: [body]
        });
        var fades = {};
        var updateEdges = function updateEdges(view, offset) {
          var range = view.MaxScroll();
          var top = range > 0 && offset > .01,
            bottom = range > 0 && offset < range - .01;
          fades.top.SetStyle({
            visible: top
          });
          fades.topLip.SetStyle({
            visible: top
          });
          fades.bottom.SetStyle({
            visible: bottom
          });
          fades.bottomLip.SetStyle({
            visible: bottom
          });
          // Leading overlaps a neighbouring row at either endpoint: keep that row hidden there; mid-scroll uses the fades.
          var vh = view.size().height;
          for (var _iterator6 = _createForOfIteratorHelperLoose(body.children), _step6; !(_step6 = _iterator6()).done;) {
            var line = _step6.value;
            var visible = range <= .01 || offset > .01 && offset < range - .01 || rowTop(line) >= offset - .01 && rowTop(line) + rowH(line) <= offset + vh + .01;
            line.SetStyle({
              visible: visible
            });
          }
        };
        var view = UI.ScrollView({
          position: 'absolute',
          left: 24,
          top: 382,
          width: 272,
          height: viewportHeight,
          showScrollbar: true,
          children: [content],
          onScroll: function onScroll(v, _x, offset) {
            return updateEdges(v, offset);
          }
        });
        book.AddChild(view);
        app.refs.handbookScroll = view;
        var fade = function fade(h, top, isTop, seal) {
          if (seal === void 0) {
            seal = 0;
          }
          var layer = UI.Panel({
            position: 'absolute',
            left: 24,
            top: top,
            width: 258,
            height: h,
            pointerEvents: 'none'
          });
          // Paper-colour bands as on the settlement detail scroll edges; an opaque seal at the edge, the gradient after it.
          if (seal > 0) layer.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: isTop ? 0 : h - seal,
            width: '100%',
            height: seal,
            backgroundColor: [254, 245, 223, 255],
            pointerEvents: 'none'
          }));
          var g = h - seal;
          for (var n = 1; n <= g; n++) {
            var remaining = g - n + 1;
            layer.AddChild(UI.Panel({
              position: 'absolute',
              left: 0,
              top: isTop ? seal : n - 1,
              width: '100%',
              height: remaining,
              backgroundColor: [254, 245, 223, Math.floor(255 / remaining + .5)],
              pointerEvents: 'none'
            }));
          }
          book.AddChild(layer);
          return layer;
        };
        fades.top = fade(18, 382, true, 5);
        fades.bottom = fade(18, 382 + viewportHeight - 18, false);
        // 2-unit paper lips seal the row scrolled past either edge.
        fades.topLip = UI.Panel({
          position: 'absolute',
          left: 24,
          top: 380,
          width: 258,
          height: 2,
          backgroundColor: [254, 245, 223, 255],
          pointerEvents: 'none'
        });
        book.AddChild(fades.topLip);
        fades.bottomLip = UI.Panel({
          position: 'absolute',
          left: 24,
          top: 382 + viewportHeight,
          width: 258,
          height: 2,
          backgroundColor: [254, 245, 223, 255],
          pointerEvents: 'none'
        });
        book.AddChild(fades.bottomLip);
        app.refs.handbookBody = body;
        app.refs.handbookFades = fades;
        view.UpdateContentSize();
        updateEdges(view, 0);
        app.refs.handbookTextFit = {
          size: size,
          height: height,
          bottom: 382 + Math.min(height, viewportHeight),
          contentBottom: 382 + height,
          scrolling: height > viewportHeight,
          lineHeight: lineHeight,
          step: step,
          leading: leading,
          viewportHeight: viewportHeight,
          visibleLines: visibleLines,
          visibleBottomLines: visibleBottomLines,
          paragraphGap: leading + 3,
          paragraphStarts: starts
        };
        var close = Button(L('合上手册'), function () {
          return Close(app);
        }, 204, 44, false, false, 23);
        close.SetStyle({
          position: 'absolute',
          left: 58,
          top: 510,
          width: 204,
          height: 44
        });
        book.AddChild(close);
        app.refs.handbookClose = close;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/home.ts", ['cc', './kit.ts', './skin.ts', './design.ts', './catView.ts', './config.ts', './i18n.ts', './assets.ts', './audio.ts', './profile.ts', './loadError.ts', './text.ts'], function (exports) {
  var cclegacy, UI, PT, Image, Face, Text, ink, ImageButton, muted, TwoLines, Row, warmRed, cream, SetDisabled, Art, colors, SceneBackground, AnchorGroup, Clear, Create, DAILY_BONUS, L, resolveAsset, setMusic, Day, Now, Open, formatNumber, textWidth, fitSize;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
      PT = module.PT;
    }, function (module) {
      Image = module.Image;
      Face = module.Face;
      Text = module.Text;
      ink = module.ink;
      ImageButton = module.ImageButton;
      muted = module.muted;
      TwoLines = module.TwoLines;
      Row = module.Row;
      warmRed = module.warmRed;
      cream = module.cream;
      SetDisabled = module.SetDisabled;
    }, function (module) {
      Art = module.Art;
      colors = module.colors;
      SceneBackground = module.SceneBackground;
      AnchorGroup = module.AnchorGroup;
    }, function (module) {
      Clear = module.Clear;
      Create = module.Create;
    }, function (module) {
      DAILY_BONUS = module.DAILY_BONUS;
    }, function (module) {
      L = module.L;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      setMusic = module.setMusic;
    }, function (module) {
      Day = module.Day;
      Now = module.Now;
    }, function (module) {
      Open = module.Open;
    }, function (module) {
      formatNumber = module.formatNumber;
      textWidth = module.textWidth;
      fitSize = module.fitSize;
    }],
    execute: function () {
      exports({
        Home: Home,
        base: base,
        pointsSign: pointsSign
      });
      cclegacy._RF.push({}, "60d66OIislMu6QHdkeKej0y", "home", undefined);
      function pointsSign(page, points) {
        var plate = Image('ui.home.points_sign', 8, 4, 116, 68);
        page.AddChild(plate);
        var _S$Face = Face('ui.home.points_sign', 8, 4, 116, 68),
          fx = _S$Face[0],
          fy = _S$Face[1],
          fw = _S$Face[2],
          fh = _S$Face[3];
        var icon = Art('ui.icon.points_matatabi', 22, 22, '');
        icon.SetStyle({
          position: 'absolute',
          left: fx,
          top: fy + (fh - 22) / 2
        });
        page.AddChild(icon);
        var label = Text(formatNumber(points), 20, fx + 26, fy, fw - 27, fh, ink, 'center');
        page.AddChild(label);
        return [plate, icon, label];
      }
      function base(app, screenName, scene, preserveCats) {
        if (preserveCats === void 0) {
          preserveCats = false;
        }
        if (!preserveCats) Clear();
        app.refs = {};
        var w = 360,
          h = 640;
        var page = UI.Panel({
          width: w,
          height: h,
          overflow: 'hidden',
          backgroundColor: colors.cream
        });
        if (scene) SceneBackground(page, w, h, scene);
        app.screen = screenName;
        app.page = page;
        return [page, w, h];
      }
      function Home(app) {
        setMusic('music.home');
        var _base = base(app, 'home', 'home.r02'),
          page = _base[0];
        // Shop name on the blank sign board of the background.
        page.AddChild(Text(L('猫猫好运铺'), 30, 64, 94, 232, 40, ink));
        // Cats stand on the counter (top line y369); the counter lip hides the flat frame bottoms.
        page.AddChild(Image('ui.home.counter_lip', 31, 365, 235, 8));
        var anchors = [124, 218];
        app.profile.equipped.forEach(function (id, i) {
          var _app$profile$cats$id$, _app$profile$cats$id;
          var actor = Create(id, (_app$profile$cats$id$ = (_app$profile$cats$id = app.profile.cats[id]) == null ? void 0 : _app$profile$cats$id.level) != null ? _app$profile$cats$id$ : 1, {
            x: anchors[i],
            y: 366,
            slot: i + 1,
            context: 'home',
            dual: app.profile.equipped.length === 2,
            scale: .85
          });
          if (actor) page.AddChild(actor);
        });
        // Top row (points sign, handbook, settings) and the two boards follow the screen edges on tall screens.
        var topRow = AnchorGroup(page, 'top');
        // Settings round plate + gear; handbook round plate + book.
        var _pointsSign = pointsSign(topRow, app.profile.points);
        app.refs.homePointsPlate = _pointsSign[0];
        app.refs.homePointsIcon = _pointsSign[1];
        app.refs.homePoints = _pointsSign[2];
        var _S$ImageButton = ImageButton('ui.common.round_plate', 306, 12, 44, 44, app.Settings, {
            pressScale: .94,
            hitPad: 2
          }),
          setRoot = _S$ImageButton[0],
          setFace = _S$ImageButton[2];
        setFace.AddChild(Image('ui.icon.gear.r02', 10, 10, 24, 24));
        topRow.AddChild(setRoot);
        var _S$ImageButton2 = ImageButton('ui.common.round_plate', 254, 12, 44, 44, app.Handbook, {
            pressScale: .94,
            hitPad: 2
          }),
          bookRoot = _S$ImageButton2[0],
          bookBtn = _S$ImageButton2[1],
          bookFace = _S$ImageButton2[2];
        bookFace.AddChild(Image('ui.icon.rules_book', 10, 10, 24, 24));
        topRow.AddChild(bookRoot);
        app.refs.homeHandbook = bookBtn;
        // Daily note on the counter front: two lines centred on the note's face (tape excluded).
        var claimed = Day(Now()) <= app.profile.lastDailyDay;
        page.AddChild(Image('ui.home.daily_note', 98, 376, 164, 72));
        {
          var _S$Face2 = Face('ui.home.daily_note', 98, 376, 164, 72, 14),
            fx = _S$Face2[0],
            fy = _S$Face2[1],
            fw = _S$Face2[2],
            fh = _S$Face2[3];
          if (claimed) {
            // Longer languages ("Today's bonus claimed") take two lines on the note instead of clipping.
            var copy = L('今日奖励已领取');
            if (textWidth(copy, 9, 'sans') <= fw) page.AddChild(Text(copy, 14, fx, fy, fw, fh, muted));else {
              var lines = TwoLines(copy, 12, 'sans');
              var size = Math.max(9, Math.min.apply(Math, [12].concat(lines.map(function (l) {
                return fitSize(l, 12, 'sans', fw / .92);
              }))));
              var lh = size * PT * 1.25,
                top = fy + (fh - 2 * lh) / 2;
              lines.forEach(function (l, k) {
                return page.AddChild(Text(l, size, fx, top + k * lh, fw, lh, muted));
              });
            }
          } else {
            page.AddChild(Text(L('今日首次有效结算'), 12, fx, fy + 3, fw, fh / 2 - 3, ink, 'center', 'body'));
            page.AddChild(Row(fx, fy + fh / 2, fw, fh / 2 - 3, [{
              text: L('额外'),
              size: 12,
              family: 'body'
            }, {
              text: L('+{0} 积分', formatNumber(DAILY_BONUS)),
              size: 16,
              color: warmRed
            }], 4));
          }
        }
        // Primary "open" board and secondary cat-house board: labels centred on each board's face.
        var _S$Face3 = Face('ui.home.button.primary', 0, 0, 220, 80, 10),
          sx = _S$Face3[0],
          sy = _S$Face3[1],
          sw = _S$Face3[2],
          sh = _S$Face3[3];
        var startLabel = Text(L('开门营业'), 28, sx, sy, sw, sh, cream);
        var startBtn, startFace;
        var disableStart = function disableStart(disabled) {
          SetDisabled(startBtn, startFace, disabled);
          var id = disabled ? 'ui.home.button.primary.disabled' : 'ui.home.button.primary';
          startBtn.SetStyle({
            opacity: 1
          });
          startFace.SetStyle({
            backgroundImage: resolveAsset(id).path,
            opacity: 1
          });
          startLabel.SetStyle({
            fontColor: disabled ? [96, 92, 88, 255] : cream
          });
        };
        var resetStart = function resetStart() {
          startLabel.SetText(L('开门营业'));
          disableStart(app.profile.loadError !== undefined);
        };
        var startRoot;
        var _S$ImageButton3 = ImageButton('ui.home.button.primary', 24, 478, 220, 80, function () {
          app.NewGame();
          if (app.starting) {
            startLabel.SetText(L('开店中…'));
            disableStart(true);
          }
        }, {
          pressScale: .96,
          disabled: app.profile.loadError !== undefined
        });
        startRoot = _S$ImageButton3[0];
        startBtn = _S$ImageButton3[1];
        startFace = _S$ImageButton3[2];
        var boards = AnchorGroup(page, 'bottom');
        startFace.AddChild(startLabel);
        disableStart(app.profile.loadError !== undefined);
        boards.AddChild(startRoot);
        app.refs.onStartReset = resetStart;
        app.refs.homeStart = startBtn;
        // 猫窝: paw icon + text centred together on the green board's face. The 11 margin keeps longer captions (Gatil,
        // Chats) off the wooden frame; 猫窝 (72 wide) still fits it unscaled, so the Chinese button is unchanged.
        var _S$ImageButton4 = ImageButton('ui.home.button.secondary', 252, 486, 96, 61, app.Cats, {
            pressScale: .96
          }),
          catsRoot = _S$ImageButton4[0],
          catsBtn = _S$ImageButton4[1],
          catsFace = _S$ImageButton4[2];
        {
          var _S$Face4 = Face('ui.home.button.secondary', 0, 0, 96, 61, 11),
            cx = _S$Face4[0],
            cy = _S$Face4[1],
            cw = _S$Face4[2],
            ch = _S$Face4[3];
          // A caption the paw would squeeze below 65% (German Katzen) takes the whole face without it.
          var caption = L('猫窝');
          var withPaw = 16 + 3 + textWidth(caption, 20, 'sans') <= cw / .65;
          catsFace.AddChild(Row(cx, cy, cw, ch, [].concat(withPaw ? [{
            icon: 'ui.icon.paw.r02',
            size: 16
          }] : [], [{
            text: caption,
            size: 20,
            color: cream
          }]), 3));
        }
        boards.AddChild(catsRoot);
        app.refs.homeCats = catsBtn;
        app.MountPage(page);
        Open(app);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/i18n.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        L: L,
        artLanguages: artLanguages,
        fontSetFor: fontSetFor,
        language: language,
        localDecimal: localDecimal,
        numberSeparators: numberSeparators,
        setLanguage: setLanguage,
        tableTexts: tableTexts,
        unescapeLua: unescapeLua,
        usesMyriad: usesMyriad
      });
      cclegacy._RF.push({}, "326e7zw5P1Hzbh/QTzhGws+", "i18n", undefined); // Text localisation (Maker repo scripts/Game/I18n.lua, docs/port-plan.md §9). Keys are the simplified-Chinese
      // source templates, shared with the Maker build; L(template, ...args) translates the whole sentence, then fills
      // {0}, {1}, ... with the arguments. The table is installed by the platform layer; with none, the source is shown.
      var table = null;
      var lang = 'zh_CN';

      // The tables are extracted from Lua source literals, so keys and values keep Lua escapes as text (\u{200B}, \n, \").
      // Decode them once when a table is installed, so lookups match the TS templates.
      function unescapeLua(text) {
        return text.replace(/\\(u\{([0-9a-fA-F]+)\}|n|t|r|"|'|\\)/g, function (whole, esc, hex) {
          if (hex) return String.fromCodePoint(parseInt(hex, 16));
          return esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === 'r' ? '\r' : esc;
        });
      }
      function setLanguage(language, translations) {
        lang = language;
        if (!translations) {
          table = null;
          return;
        }
        var decoded = {};
        for (var _i = 0, _Object$keys = Object.keys(translations); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          decoded[unescapeLua(key)] = unescapeLua(translations[key]);
        }
        table = decoded;
      }

      // Every source and translated text of the installed table (tools/layout-audit.ts tells copy ending in "…" from cuts).
      function tableTexts() {
        return table ? Object.keys(table).concat(Object.values(table)) : [];
      }
      function language() {
        return lang;
      }

      // Templates looked up without a translation while a table is installed (checked by tools in the web build).
      var misses = exports('misses', {});
      function L(template) {
        var _table, _misses$template;
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var translated = (_table = table) == null ? void 0 : _table[template];
        if (table && !translated && /[㐀-鿿]/.test(template)) misses[template] = ((_misses$template = misses[template]) != null ? _misses$template : 0) + 1;
        var text = translated ? translated : template;
        if (args.length === 0) return text;
        return text.replace(/\{(\d+)\}/g, function (whole, i) {
          var v = args[Number(i)];
          return v !== undefined && v !== null ? localDecimal(String(v)) : whole;
        });
      }

      // A plain decimal number ("1.5", from toFixed or a tuning value) with the language's decimal mark ("1,5"). Three digits
      // after the point are a grouped integer from formatNumber ("38.420" in German) and stay as they are.
      function localDecimal(text) {
        var mark = numberSeparators().decimal;
        return mark !== '.' && /^[+-]?\d+\.\d{1,2}$/.test(text) ? text.replace('.', mark) : text;
      }

      // Whether the current language groups big numbers by 10,000 (万/萬/만) instead of by thousands.
      function usesMyriad() {
        return lang === 'zh_CN' || lang === 'zh_TW' || lang === 'ja' || lang === 'ko';
      }

      // Thousands and decimal separators: 38,420 / 1.2M in English and the CJK languages, 38.420 / 1,2M in Spanish,
      // Portuguese and German, 38 420 / 1,2M (no-break space) in French and Russian.
      function numberSeparators() {
        if (lang === 'es' || lang === 'pt' || lang === 'de') return {
          group: '.',
          decimal: ','
        };
        if (lang === 'fr' || lang === 'ru') return {
          group: ' ',
          decimal: ','
        };
        return {
          group: ',',
          decimal: '.'
        };
      }

      // The font subset a language draws with (assets/resources/fonts/<face>-<set>): CJK for Chinese and Japanese,
      // Hangul for Korean, Latin (with Cyrillic) for the rest.
      function fontSetFor(language) {
        if (language === 'zh_CN' || language === 'zh_TW' || language === 'ja') return 'cjk';
        return language === 'ko' ? 'ko' : 'latin';
      }

      // Art with lettering (the shop sign) has variants for a few languages only: Chinese in both scripts keeps the source
      // art, every other language (Japanese included: the source art is Simplified Chinese) falls back to the English one.
      function artLanguages(language) {
        return language === 'en' || language === 'zh_CN' || language === 'zh_TW' ? [language] : [language, 'en'];
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/itemOverlay.ts", ['cc', './kit.ts', './skin.ts', './design.ts', './config.ts', './i18n.ts', './assets.ts', './audio.ts', './itemTags.ts', './rerollAd.ts', './adLoading.ts', './tips.ts', './text.ts'], function (exports) {
  var cclegacy, UI, PT, Text, FitWidth, Block, Face, Image, TwoLines, UpgradeArt, colors, routes, ItemText, goods, REROLL_AD_DAILY_CAP, L, resolveAsset, playCue, Tags, TagRow, TagWords, State, BlocksChoice, Caption, Click, Blocked, Event, Waiting, wrap, textWidth, fitSize;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
      PT = module.PT;
    }, function (module) {
      Text = module.Text;
      FitWidth = module.FitWidth;
      Block = module.Block;
      Face = module.Face;
      Image = module.Image;
      TwoLines = module.TwoLines;
    }, function (module) {
      UpgradeArt = module.UpgradeArt;
      colors = module.colors;
    }, function (module) {
      routes = module.routes;
      ItemText = module.ItemText;
      goods = module.goods;
      REROLL_AD_DAILY_CAP = module.REROLL_AD_DAILY_CAP;
    }, function (module) {
      L = module.L;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      playCue = module.playCue;
    }, function (module) {
      Tags = module.Tags;
      TagRow = module.TagRow;
      TagWords = module.TagWords;
    }, function (module) {
      State = module.State;
      BlocksChoice = module.BlocksChoice;
      Caption = module.Caption;
      Click = module.Click;
    }, function (module) {
      Blocked = module.Blocked;
    }, function (module) {
      Event = module.Event;
      Waiting = module.Waiting;
    }, function (module) {
      wrap = module.wrap;
      textWidth = module.textWidth;
      fitSize = module.fitSize;
    }],
    execute: function () {
      exports({
        CloseDetail: CloseDetail,
        GetInfo: GetInfo,
        ShowChoice: ShowChoice,
        ShowDetail: ShowDetail
      });
      cclegacy._RF.push({}, "b45e9n0KndAIZul4eDtgcBx", "itemOverlay", undefined);
      var K = colors;
      var EFFECTS = exports('EFFECTS', {
        display_feature: ["\u6D88\u9664\u504F\u597D\u54C1\u65F6\uFF0C\u200B\u5F97\u5206\u4ECE 2 \u500D\u200B\u53D8\u6210 {prefMult} \u500D\u3002", '偏好品'],
        display_filter: ['补货时只会出现 4 种商品，两种偏好品一定在里面。', '补货时'],
        display_pair: ['每次交换后补货时，会把棋盘上 1 件商品变成偏好品。', '首次补货'],
        display_regular: ['连消到第 3 轮以后，消除偏好品的得分再多 {regular%}%。', '第 3 轮起'],
        display_window: ['每消除 {windowEvery} 件偏好品，接下来补上的 {windowRefill} 件都会是偏好品。', '消除 {windowEvery} 件'],
        display_sample: ['每交一单，下次补货时会把 {sampleConvert} 件商品变成偏好品。', '交单时'],
        display_tag: ['消除偏好品时，得分多 {tag%}%。', '消除偏好品'],
        display_rush: ['每消除 {rushEvery} 件偏好品，就再得 {counterScore} 分，算进当前订单。', '消除 {rushEvery} 件'],
        bake_foam: ['每有 {foamEvery} 次交换成功消除，补货时就送你 1 枚炸弹。', '交换消除'],
        bake_tray: ['炸弹的爆炸范围从 3×3 变成 5×5。', '爆炸时'],
        bake_core: ['每引爆 {coreEvery} 枚炸弹，就送你 {coreGive} 枚炸弹。', '引爆 {coreEvery} 枚'],
        bake_caramel: ['被炸弹炸掉的商品，得分多 {caramel%}%。', '爆炸时'],
        bake_candle: ['同一次交换里接连炸了好几枚炸弹时，第 2 枚得分多 {candleStep%}%，第 3 枚起多 {candleMax%}%。', '接连爆炸'],
        bake_oven: ['每交一单，就送你 1 枚炸弹。', '交单时'],
        bake_fuse: ['每引爆 1 枚炸弹或 1 个线消，上场的猫各攒 {fuseCharge} 点能量。', '引爆时'],
        bake_timer: ['每引爆 {specialEvery} 枚炸弹，就再得 {counterScore} 分，算进当前订单。', '引爆 {specialEvery} 枚'],
        ribbon_spool: ['每消除 {spoolEvery} 件商品，就送你 1 个线消；交换时直接连出四件一排，还会再多送 1 个。', '消除 {spoolEvery} 件'],
        ribbon_cross: ['线消发动时，会同时清掉它所在的一整行和一整列。', '引爆时'],
        ribbon_relay: ['每引爆 {relayEvery} 个线消，就送你 {relayGive} 个线消。', '引爆 {relayEvery} 枚'],
        ribbon_tip: ['被线消清掉的商品，得分多 {tip%}%。', '引爆时'],
        ribbon_finale: ['同一次交换里接连引爆线消时，第 2 个得分多 {finaleStep%}%，之后每个再多 {finaleStep%}%，最多多 {finaleMax%}%。', '接连引爆'],
        ribbon_bow: ['每交一单，就送你 {bowCount} 个线消，一个清行，一个清列。', '交单时'],
        ribbon_wide: ['线消发动时，一次清掉两行或两列。', '引爆时'],
        ribbon_measure: ['炸弹和线消合在一起算，每引爆 {ribbonEvery} 个，就再得 {counterScore} 分，算进当前订单。', '引爆 {ribbonEvery} 枚'],
        general_ledger: ['每交一单，下一单就先装进 {ledger} 分。', '交单时'],
        general_hourglass: ['所有加时都多 {hourglass%}%，越到后面加得越少这一点不变。', '加时'],
        general_stamp: ['从下一单起，每单需要的分数少 {stamp%}%。', '新订单']
      });
      function place(widget, x, y, w, h) {
        widget.SetStyle({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h
        });
        return widget;
      }
      function GetInfo(upgrade) {
        var _EFFECTS$upgrade$id;
        var copy = (_EFFECTS$upgrade$id = EFFECTS[upgrade.id]) != null ? _EFFECTS$upgrade$id : [upgrade.description, '持续生效'];
        // Numbers come from Config.ITEM_TUNING so a retune can never make the card wrong.
        var route = routes[upgrade.route];
        return {
          id: upgrade.id,
          name: L(upgrade.name),
          route: route ? L(route.name) : '',
          effectSentence: ItemText(L(copy[0])),
          triggerLabel: ItemText(L(copy[1])),
          tags: Tags(upgrade),
          definition: upgrade
        };
      }
      function label(text, size, color) {
        return UI.Label({
          minFontSize: 9,
          text: text,
          fontSize: size,
          fontColor: color != null ? color : K.ink,
          textAlign: 'left',
          whiteSpace: 'normal',
          fontFamily: 'body',
          pointerEvents: 'none'
        });
      }
      // Description area: the name with its tag capsules inline, then the effect as a wrapped block.
      function descriptionView(app, mode) {
        var box = UI.Panel({
          position: 'absolute',
          left: 13,
          top: 148,
          width: 278,
          height: 106,
          borderRadius: 10,
          overflow: 'visible',
          pointerEvents: 'none'
        });
        app.refs.itemDescription = {
          box: box,
          mode: mode
        };
        return box;
      }
      function updateDescription(app, info, message) {
        var refs = app.refs.itemDescription;
        var box = refs.box;
        box.ClearChildren();
        refs.effectText = undefined;
        refs.tags = undefined;
        if (!info) {
          refs.name = Text(L(message != null ? message : '选择一件查看效果'), 14, 18, 34, 242, 32, K.ink, 'center', 'sans');
          box.AddChild(refs.name);
          return;
        }
        var X = 80,
          Wd = 190;
        refs.icon = place(UpgradeArt(info.definition, 64, goods), 6, 21, 64, 64);
        box.AddChild(refs.icon);
        // Whole-sentence copy may need four lines: both views keep the name and tag row; four lines start 2 units higher.
        var _long = wrap(info.effectSentence, 9, 'body', Wd * .95).length > 3;
        var effectY = _long ? 30 : 32,
          effectLines = _long ? 4 : 3;
        var nameW = Math.min(Wd - 60, textWidth(info.name, 15, 'sans') + 1);
        refs.name = Text(info.name, 15, X, 6, nameW, 22, K.ink, 'left', 'sans');
        box.AddChild(refs.name);
        // The tags follow the name as drawn.
        var drawn = Math.min(nameW, Math.ceil(FitWidth(info.name, 15, 'sans', nameW, 22)));
        var holder = UI.Panel({
          position: 'absolute',
          left: X + drawn + 8,
          top: 8,
          width: Wd - drawn - 8,
          height: 18,
          pointerEvents: 'none'
        });
        var tags = TagRow(info.tags, 9.5, 18, Wd - drawn - 8, 'left').row;
        holder.AddChild(tags);
        box.AddChild(holder);
        refs.tags = tags;
        var _S$Block = Block(info.effectSentence, 9.5, X, effectY, Wd, K.ink, 'body', 'left', 1.3, effectLines, 9),
          effect = _S$Block[0],
          h = _S$Block[1];
        // Keep four long lines inside the card's inner bottom (y 96).
        if (_long && effectY + h + 2 > 96) {
          var size = effect.children[0].props.fontSize;
          var px = size * PT;
          var lineHeight = ((96 - effectY - 2) / px - .6) / effect.children.length;
          effect.Destroy();
          var _S$Block2 = Block(info.effectSentence, size, X, effectY, Wd, K.ink, 'body', 'left', lineHeight, effectLines, size);
          effect = _S$Block2[0];
          h = _S$Block2[1];
        }
        box.AddChild(effect);
        refs.effectText = info.effectSentence;
        refs.effectBlock = effect;
      }

      // Plate 32 tall with a transparent 44-tall hit area centred on it; text on the plate's measured face.
      function imageButton(textValue, x, y, w, primary, _onClick, disabled) {
        var id = primary ? 'ui.item_overlay.button.primary' : 'ui.item_overlay.button.secondary';
        var labelView = label(textValue, 12, disabled ? K.muted : K.ink);
        var _S$Face = Face(id, 0, 6, w, 32, 6),
          fx = _S$Face[0],
          fy = _S$Face[1],
          fw = _S$Face[2],
          fh = _S$Face[3];
        labelView.SetStyle({
          position: 'absolute',
          left: fx,
          top: fy,
          width: fw,
          height: fh,
          whiteSpace: 'nowrap',
          fontFamily: 'sans',
          verticalAlign: 'middle',
          textAlign: 'center'
        });
        var root = UI.Panel({
          position: 'absolute',
          left: x,
          top: y - 6,
          width: w,
          height: 44
        });
        var asset = resolveAsset(id);
        var plate = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 6,
          width: w,
          height: 32,
          borderRadius: 11,
          opacity: disabled ? .68 : 1,
          pointerEvents: 'none',
          backgroundImage: asset ? asset.path : null,
          backgroundFit: 'fill',
          backgroundColor: asset ? undefined : primary ? [242, 173, 83, 255] : [255, 244, 218, 255]
        });
        root.AddChild(plate);
        var button = UI.Button({
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: 44,
          borderRadius: 11,
          disabled: disabled,
          onClick: function onClick() {
            playCue('sfx.click');
            _onClick();
          }
        });
        root.AddChild(button);
        root.AddChild(labelView);
        return [root, button, labelView];
      }
      function setButtonDisabled(root, button, labelView, disabled) {
        button.SetDisabled(disabled);
        root.SetStyle({
          opacity: disabled ? .68 : 1
        });
        labelView.SetStyle({
          fontColor: disabled ? K.muted : K.ink
        });
      }
      function adButton(app, state) {
        var _asset$slice;
        var disabled = BlocksChoice(app) || state.status === 'save-failed' && state.locked === true;
        var copy = Caption(state);
        var _imageButton = imageButton(copy, 0, 6, 118, false, function () {
            return Click(app);
          }, disabled),
          root = _imageButton[0],
          button = _imageButton[1],
          caption = _imageButton[2];
        root.SetStyle({
          height: 52,
          overflow: 'visible'
        });
        var plate = root.children[0];
        var asset = resolveAsset('ui.result.ad_button');
        if (!asset) throw new Error('Missing approved reroll ad button');
        // The approved wood face and rounded ends at the original reroll button size.
        var scale = 32 / asset.height;
        plate.SetStyle({
          backgroundImage: null,
          backgroundColor: [0, 0, 0, 0],
          opacity: 1
        });
        plate.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 118 / scale,
          height: asset.height,
          scale: scale,
          transformOrigin: 'top-left',
          backgroundImage: asset.path,
          backgroundFit: 'sliced',
          backgroundSlice: (_asset$slice = asset.slice) != null ? _asset$slice : asset.slices,
          pointerEvents: 'none'
        }));
        var family = state.status === 'failed' ? 'body' : 'sans';
        var color = state.status === 'failed' ? [190, 70, 50, 255] : disabled ? K.muted : K.ink;
        if (textWidth(copy, 9, family) <= 78) {
          var size = fitSize(copy, 11, family, 78);
          var textW = textWidth(copy, size, family);
          var groupX = (118 - (14 + 3 + textW)) / 2;
          root.AddChild(Image('ui.icon.ad_video', groupX, 15, 14, 14));
          caption.SetStyle({
            left: groupX + 17,
            top: 6,
            width: textW + 1,
            height: 32,
            textAlign: 'left',
            fontSize: size,
            minFontSize: 9,
            fontFamily: family,
            fontColor: color
          });
        } else {
          // Longer languages ("Watch ad: rerolls +2"): two balanced lines beside the icon, inside the 32-tall plate.
          var lines = TwoLines(copy, 9, family);
          var _size = Math.max(8, Math.min.apply(Math, [10].concat(lines.map(function (l) {
            return fitSize(l, 10, family, 82 / .92);
          }))));
          var _textW = Math.max.apply(Math, lines.map(function (l) {
            return textWidth(l, _size, family);
          }));
          var _groupX = (118 - (14 + 3 + _textW)) / 2,
            lh = _size * PT * 1.1,
            top = 6 + (32 - 2 * lh) / 2;
          root.AddChild(Image('ui.icon.ad_video', _groupX, 15, 14, 14));
          caption.SetStyle({
            text: '',
            left: _groupX + 17,
            top: 6,
            width: _textW + 1,
            height: 32
          });
          lines.forEach(function (l, k) {
            return root.AddChild(Text(l, _size, _groupX + 17, top + k * lh, _textW + 1, lh, color, 'left', family));
          });
        }
        var daily = Text(L('今日 {0}/{1}', state.remainingToday, REROLL_AD_DAILY_CAP), 9, 0, 39, 118, 13, K.ink, 'center', 'body');
        root.AddChild(daily);
        app.refs.itemRerollDaily = daily;
        app.refs.itemRerollAdButton = button;
        return [root, button, caption];
      }
      function shell(app, title, mode) {
        var _app$refs$itemOverlay;
        (_app$refs$itemOverlay = app.refs.itemOverlayRoot) == null || _app$refs$itemOverlay.Destroy();
        app.page.SetStyle({
          opacity: 1
        });
        // The root swallows touches so the page underneath stays inert.
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          onClick: function onClick() {}
        });
        var mask = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundColor: [47, 32, 20, 150]
        });
        var shellAsset = resolveAsset('ui.item_overlay.shell');
        var panel = UI.Panel({
          position: 'absolute',
          left: 28,
          top: 164,
          width: 304,
          height: 306,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: shellAsset ? [0, 0, 0, 0] : [255, 247, 224, 255],
          borderWidth: shellAsset ? 0 : 2,
          borderColor: [112, 69, 36, 255]
        });
        // The ad caption extends only the lower paper band; title, candidates and description stay put.
        if (shellAsset) {
          var art = UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: shellAsset.width,
            height: shellAsset.height,
            scale: 304 / shellAsset.width,
            transformOrigin: 'top-left',
            backgroundImage: shellAsset.path,
            backgroundFit: 'sliced',
            backgroundSlice: [shellAsset.height - 48, 54, 42, 54],
            pointerEvents: 'none'
          });
          panel.AddChild(art);
          app.refs.itemOverlayArt = art;
        }
        // 13 pt on a line box at y24: leaves >= 6 between the glyphs and a selected card.
        var heading = place(label(L(title), 13, K.ink), 14, 24, 276, 19);
        heading.SetStyle({
          textAlign: 'center',
          fontFamily: 'sans',
          whiteSpace: 'nowrap',
          verticalAlign: 'middle'
        });
        panel.AddChild(heading);
        panel.AddChild(descriptionView(app, mode));
        root.AddChild(mask);
        root.AddChild(panel);
        app.page.AddChild(root);
        root.Animate({
          keyframes: {
            0: {
              opacity: 0
            },
            1: {
              opacity: 1
            }
          },
          duration: .18,
          fillMode: 'both',
          easing: 'easeOut'
        });
        panel.Animate({
          keyframes: {
            0: {
              translateY: 10,
              scale: .97
            },
            1: {
              translateY: 0,
              scale: 1
            }
          },
          duration: .22,
          fillMode: 'both',
          easing: 'easeOut'
        });
        app.refs.itemOverlayRoot = root;
        app.refs.itemOverlayPanel = panel;
        app.refs.itemOverlayTitle = heading;
        return panel;
      }
      // Icon 44 above the card's divider (y66.5), the name between, the tag words below it.
      function candidateButton(upgrade, index, onSelect) {
        var x = index * 96;
        var _S$Face2 = Face('ui.item_overlay.candidate', 0, 0, 88, 98, 6),
          fx = _S$Face2[0],
          fw = _S$Face2[2];
        var root = UI.Panel({
          position: 'absolute',
          left: x,
          top: 0,
          width: 88,
          height: 98,
          overflow: 'visible'
        });
        // The selected card's glow (urhox boxShadow x0 y6 blur10 spread1, warm gold): soft rounded layers under the card.
        var glow = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 88,
          height: 98,
          overflow: 'visible',
          pointerEvents: 'none',
          opacity: 0
        });
        for (var i = 5; i >= 1; i--) {
          var g = 1 + i * 2;
          glow.AddChild(UI.Panel({
            position: 'absolute',
            left: -g,
            top: 6 - g,
            width: 88 + 2 * g,
            height: 98 + 2 * g,
            borderRadius: 11 + g,
            backgroundColor: [241, 173, 54, 36],
            pointerEvents: 'none'
          }));
        }
        root.AddChild(glow);
        var asset = resolveAsset('ui.item_overlay.candidate');
        var candidate = {};
        var button = UI.Button({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 88,
          height: 98,
          borderRadius: 11,
          backgroundImage: asset ? asset.path : null,
          backgroundFit: 'fill',
          backgroundColor: asset ? undefined : [255, 247, 226, 255],
          onClick: function onClick() {
            playCue('sfx.select');
            onSelect(candidate, upgrade);
          }
        });
        button.AddChild(place(UpgradeArt(upgrade, 44, goods), 22, 7, 44, 44));
        button.AddChild(Text(L(upgrade.name), 11, fx, 50, fw, 15, K.ink, 'center', 'sans'));
        var tagHolder = UI.Panel({
          position: 'absolute',
          left: fx,
          top: 69,
          width: fw,
          height: 16,
          pointerEvents: 'none'
        });
        tagHolder.AddChild(TagWords(Tags(upgrade), 9, 16, fw));
        button.AddChild(tagHolder);
        root.AddChild(button);
        candidate.root = root;
        candidate.button = button;
        candidate.glow = glow;
        return candidate;
      }
      function ShowChoice(app) {
        var g = app.g;
        app.screen = 'upgrade';
        g.drag = undefined;
        g.queued = undefined;
        var panel = shell(app, '订单完成 · 选择一件谢礼', 'choice');
        var content = UI.Panel({
          position: 'absolute',
          left: 13,
          top: 45,
          width: 280,
          height: 98,
          overflow: 'visible'
        });
        panel.AddChild(content);
        var candidates = [];
        var selectedId;
        var confirmRoot, confirm, confirmLabel;
        var setSelected = function setSelected(c, upgrade) {
          if (BlocksChoice(app) || Blocked(app)) return;
          selectedId = upgrade.id;
          for (var _i = 0, _candidates = candidates; _i < _candidates.length; _i++) {
            var other = _candidates[_i];
            other.root.SetStyle({
              translateY: 0,
              scale: 1
            });
            other.glow.SetStyle({
              opacity: 0
            });
          }
          // 1 down (the 1.02 scale grows it 1 upward) with the glow at the sides and below: title gap >= 6.
          c.root.SetStyle({
            translateY: 1,
            scale: 1.02
          });
          c.glow.SetStyle({
            opacity: 1
          });
          updateDescription(app, GetInfo(upgrade));
          setButtonDisabled(confirmRoot, confirm, confirmLabel, false);
          confirmLabel.SetText(L('确认收下'));
        };
        var buildChoices = function buildChoices() {
          selectedId = undefined;
          content.ClearChildren();
          candidates = [];
          g.run.GetUpgradeChoices().forEach(function (upgrade, i) {
            var c = candidateButton(upgrade, i, setSelected);
            content.AddChild(c.root);
            candidates.push(c);
          });
          app.refs.itemCandidates = candidates.map(function (c) {
            return c.button;
          });
          updateDescription(app);
          if (confirm) {
            setButtonDisabled(confirmRoot, confirm, confirmLabel, true);
            confirmLabel.SetText(L('请选择道具'));
          }
        };
        var rerollSlot = UI.Panel({
          position: 'absolute',
          left: 24,
          top: 255,
          width: 118,
          height: 52,
          overflow: 'visible'
        });
        panel.AddChild(rerollSlot);
        var doReroll = function doReroll() {
          if (BlocksChoice(app) || Blocked(app)) return;
          var _g$run$TryReroll = g.run.TryReroll(),
            ok = _g$run$TryReroll[0],
            reason = _g$run$TryReroll[1];
          if (ok) {
            app.Events();
            buildChoices();
            app.refs.refreshRerollAd();
          } else updateDescription(app, undefined, reason === 'empty_pool' ? '没有新的候选，本次未扣次数' : '本局重抽次数已经用完');
        };
        app.refs.refreshRerollAd = function () {
          var _app$refs$itemOverlay2;
          rerollSlot.ClearChildren();
          app.refs.itemRerollDaily = undefined;
          app.refs.itemRerollAdButton = undefined;
          var state = State(app);
          var height = state && state.visible ? 324 : 306;
          panel.SetStyle({
            height: height
          });
          (_app$refs$itemOverlay2 = app.refs.itemOverlayArt) == null || _app$refs$itemOverlay2.SetStyle({
            height: height * 3
          });
          var rerollRoot, reroll, rerollLabel;
          if (state && state.visible) {
            var _adButton = adButton(app, state);
            rerollRoot = _adButton[0];
            reroll = _adButton[1];
            rerollLabel = _adButton[2];
          } else {
            var _imageButton2 = imageButton(L('重抽 · 剩 {0}', g.run.GetRerollRemaining()), 0, 6, 118, false, doReroll, g.run.GetRerollRemaining() <= 0 || BlocksChoice(app));
            rerollRoot = _imageButton2[0];
            reroll = _imageButton2[1];
            rerollLabel = _imageButton2[2];
          }
          rerollSlot.AddChild(rerollRoot);
          app.refs.itemReroll = reroll;
          app.refs.itemRerollLabel = rerollLabel;
          if (confirm) setButtonDisabled(confirmRoot, confirm, confirmLabel, !selectedId || BlocksChoice(app));
          for (var _i2 = 0, _candidates2 = candidates; _i2 < _candidates2.length; _i2++) {
            var _c = _candidates2[_i2];
            _c.button.SetDisabled(BlocksChoice(app));
          }
        };
        var _imageButton3 = imageButton(L('请选择道具'), 150, 261, 130, true, function () {
          if (BlocksChoice(app) || Blocked(app)) return;
          // Keep the first choice open while its teaching waits for the overlay entrance to finish.
          if (Waiting(app)) return;
          if (selectedId && g.run.ChooseUpgrade(selectedId)) {
            // Play resumes at once; the clock was frozen while the overlay was open.
            playCue('sfx.upgrade_pick');
            app.Game();
            app.Events();
            g.resumeDelay = 0;
          }
        }, true);
        confirmRoot = _imageButton3[0];
        confirm = _imageButton3[1];
        confirmLabel = _imageButton3[2];
        panel.AddChild(confirmRoot);
        app.refs.itemConfirm = confirm;
        buildChoices();
        app.refs.refreshRerollAd();
        playCue('sfx.upgrade_open');
        Event(app, {
          type: 'choice_open'
        });
      }
      function ShowDetail(app, upgrade) {
        var g = app.g;
        g.resumeDelay = 0;
        if (g.play) {
          g.play.feedback.SetText(g.lastChainFeedback);
          if (app.screen === 'game') app.RefreshHUD();
        }
        app.screen = 'item_detail';
        g.drag = undefined;
        g.queued = undefined;
        var panel = shell(app, '道具详情', 'detail');
        var info = GetInfo(upgrade);
        var hero = UI.Panel({
          position: 'absolute',
          left: 13,
          top: 45,
          width: 278,
          height: 98,
          pointerEvents: 'none'
        });
        // Approved R03 detail hero: soft layered glow + large icon + name, all inside the hero card.
        for (var _i3 = 0, _arr = [[120, 60], [100, 100], [82, 150], [64, 190]]; _i3 < _arr.length; _i3++) {
          var _arr$_i = _arr[_i3],
            d = _arr$_i[0],
            a = _arr$_i[1];
          var h = Math.min(d * .72, 66);
          hero.AddChild(UI.Panel({
            position: 'absolute',
            left: 139 - d / 2,
            top: 38 - h / 2,
            width: d,
            height: h,
            borderRadius: h / 2,
            backgroundColor: [255, 222, 132, a],
            pointerEvents: 'none'
          }));
        }
        hero.AddChild(place(UpgradeArt(upgrade, 62, goods), 108, 7, 62, 62));
        var heroName = place(label(L(upgrade.name), 15, K.ink), 24, 75, 230, 18);
        heroName.SetStyle({
          textAlign: 'center',
          fontFamily: 'sans',
          whiteSpace: 'nowrap'
        });
        hero.AddChild(heroName);
        panel.AddChild(hero);
        updateDescription(app, info);
        var _imageButton4 = imageButton(L('继续营业'), 84, 261, 136, true, function () {
            return CloseDetail(app);
          }, false),
          continueRoot = _imageButton4[0],
          cont = _imageButton4[1];
        panel.AddChild(continueRoot);
        app.refs.itemContinue = cont;
      }
      // Closes the in-run item detail and returns to play (button and back key share this path).
      function CloseDetail(app) {
        var _app$refs$itemOverlay3;
        if (app.screen !== 'item_detail') return;
        (_app$refs$itemOverlay3 = app.refs.itemOverlayRoot) == null || _app$refs$itemOverlay3.Destroy();
        app.refs.itemOverlayRoot = undefined;
        app.refs.itemOverlayPanel = undefined;
        app.refs.itemDescription = undefined;
        app.screen = 'game';
        app.g.resumeDelay = 0;
        app.RefreshHUD();
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/itemTags.ts", ['cc', './kit.ts', './skin.ts', './design.ts', './config.ts', './i18n.ts', './text.ts'], function (exports) {
  var cclegacy, UI, Image, Text, FitWidth, colors, TAGS, L, textWidth;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Text = module.Text;
      FitWidth = module.FitWidth;
    }, function (module) {
      colors = module.colors;
    }, function (module) {
      TAGS = module.TAGS;
    }, function (module) {
      L = module.L;
    }, function (module) {
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports({
        TagRow: TagRow,
        TagWords: TagWords,
        Tags: Tags
      });
      cclegacy._RF.push({}, "a2531ydwCNOLbGvYI9eqzFF", "itemTags", undefined);
      function Tags(upgrade) {
        var _upgrade$tags;
        return ((_upgrade$tags = upgrade.tags) != null ? _upgrade$tags : []).map(function (id) {
          return {
            id: id,
            name: L(TAGS[id].name),
            icon: TAGS[id].icon
          };
        });
      }

      // Tag capsules (concept item-tags-r01 A, approved 2026-10-16): soft fill, 1-unit dark brown outline, icon then the
      // two-character name at the 9 pt minimum with 7 units after the text. Two tags share one split capsule, text only.
      var TAG_FILL = exports('TAG_FILL', {
        preferred: [244, 178, 176, 255],
        bomb: [206, 184, 236, 255],
        line: [178, 226, 212, 255],
        order: [246, 214, 140, 255]
      });
      function TagRow(tags, size, h, maxW, align) {
        var is = h - 4,
          sz = Math.max(9, size),
          r = h / 2;
        var border = [112, 72, 42, 255];
        if (tags.length === 1) {
          // The 线消 icon is a flat row piece and reads smaller than the others; it is drawn h wide.
          var t = tags[0];
          var iw = t.id === 'line' ? h : is;
          var w = 3 + iw + 3 + textWidth(t.name, sz, 'body') + 7;
          var _row = UI.Panel({
            position: 'absolute',
            left: align === 'center' ? (maxW - w) / 2 : 0,
            top: 0,
            width: w,
            height: h,
            pointerEvents: 'none'
          });
          var chip = UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: w,
            height: h,
            borderRadius: r,
            backgroundColor: TAG_FILL[t.id],
            borderWidth: 1,
            borderColor: border,
            pointerEvents: 'none'
          });
          chip.AddChild(Image(t.icon, 3, (h - iw) / 2, iw, iw));
          chip.AddChild(Text(t.name, sz, 3 + iw + 3, 0, w - iw - 6 - 7, h, colors.ink, 'left', 'body'));
          _row.AddChild(chip);
          return {
            row: _row,
            width: w
          };
        }
        var list = tags.map(function (t) {
          return 6.5 + textWidth(t.name, sz, 'body') + 6.5;
        });
        var total = list.reduce(function (a, b) {
          return a + b;
        }, -1);
        var row = UI.Panel({
          position: 'absolute',
          left: align === 'center' ? (maxW - total) / 2 : 0,
          top: 0,
          width: total,
          height: h,
          pointerEvents: 'none'
        });
        var x = 0;
        tags.forEach(function (t, i) {
          // The halves overlap by their 1-unit borders, which become the divider.
          var half = UI.Panel({
            position: 'absolute',
            left: x,
            top: 0,
            width: list[i],
            height: h,
            borderRadius: i === 0 ? [r, 0, 0, r] : [0, r, r, 0],
            backgroundColor: TAG_FILL[t.id],
            borderWidth: 1,
            borderColor: border,
            pointerEvents: 'none'
          });
          half.AddChild(Text(t.name, sz, 6.5, 0, list[i] - 13, h, colors.ink, 'center', 'body'));
          row.AddChild(half);
          x += list[i] - 1;
        });
        return {
          row: row,
          width: total
        };
      }

      // The choice card shows its tags as coloured words, no capsule ("线消 · 爆炸"), centred by drawn width; between two
      // words a 3-unit round dot with 3 units each side (user choice 2026-10-17).
      var TAG_INK = exports('TAG_INK', {
        preferred: [176, 64, 64, 255],
        bomb: [108, 70, 156, 255],
        line: [28, 112, 92, 255],
        order: [146, 92, 14, 255]
      });
      function TagWords(tags, size, h, maxW) {
        var sz = Math.max(9, size),
          dot = 3,
          gap = 3;
        var widths = tags.map(function (t) {
          return Math.ceil(FitWidth(t.name, sz, 'body', 200, h));
        });
        var total = widths.reduce(function (a, b, i) {
          return a + b + (i > 0 ? gap + dot + gap : 0);
        }, 0);
        var row = UI.Panel({
          position: 'absolute',
          left: (maxW - total) / 2,
          top: 0,
          width: total,
          height: h,
          pointerEvents: 'none'
        });
        var x = 0;
        tags.forEach(function (t, i) {
          if (i > 0) {
            row.AddChild(UI.Panel({
              position: 'absolute',
              left: x + gap,
              top: (h - dot) / 2,
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: [160, 128, 96, 255],
              pointerEvents: 'none'
            }));
            x += gap + dot + gap;
          }
          row.AddChild(Text(t.name, sz, x, 0, widths[i], h, TAG_INK[t.id], 'center', 'body'));
          x += widths[i];
        });
        return row;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/kit.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './text.ts', './assets.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _inheritsLoose, _extends, cclegacy, resources, TTFFont, sys, Size, Vec3, UITransform, UIOpacity, Mask, Node, Graphics, Color, Sprite, Label, tween, SpriteFrame, director, Rect, Layers, setMeasure, textWidth, wrap, resolveAsset;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _inheritsLoose = module.inheritsLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
      resources = module.resources;
      TTFFont = module.TTFFont;
      sys = module.sys;
      Size = module.Size;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
      UIOpacity = module.UIOpacity;
      Mask = module.Mask;
      Node = module.Node;
      Graphics = module.Graphics;
      Color = module.Color;
      Sprite = module.Sprite;
      Label = module.Label;
      tween = module.tween;
      SpriteFrame = module.SpriteFrame;
      director = module.director;
      Rect = module.Rect;
      Layers = module.Layers;
    }, function (module) {
      setMeasure = module.setMeasure;
      textWidth = module.textWidth;
      wrap = module.wrap;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }],
    execute: function () {
      exports({
        ImageStrips: ImageStrips,
        currentScene: currentScene,
        loadFonts: loadFonts,
        loadSpriteFrame: loadSpriteFrame,
        measure: measure,
        resolve: resolve
      });
      cclegacy._RF.push({}, "21ca3UFv/BDl7EDO3CZBpIA", "kit", undefined);
      var PT = exports('PT', 4 / 3);
      var LINE_EM = exports('LINE_EM', 1.448);
      var FAMILY_ASSET = {
        sans: 'NotoSansSC-Black',
        body: 'NotoSansSC-Text',
        'boot-sans': 'NotoSansSC-Black',
        'boot-body': 'NotoSansSC-Text',
        names: 'NotoSansSC-Black-names',
        'names-ko': 'NotoSansKR-Black-names'
      };
      // The language picker's names (each language in its own script) use the same two small subsets with every font set.
      var FIXED_FONTS = ['NotoSansSC-Black-names', 'NotoSansKR-Black-names'];
      var fonts = {};

      // Loads the two faces of the current font set (cjk, latin or ko, docs/port-plan.md §9) before any page is built.
      // The Korean set is cut from Noto Sans KR (same design as Noto Sans SC, which has no Hangul).
      // All or nothing: a language switch whose fonts fail to load leaves the current faces in place.
      // still(): false when the caller no longer wants this set (a cancelled or superseded language switch).
      function loadFonts(set, still) {
        // No spread or for-of over Set/Map: Cocos builds in loose mode, where they compile to array operations.
        var names = Object.values(FAMILY_ASSET).filter(function (n, i, all) {
          return all.indexOf(n) === i;
        });
        var loaded = {};
        return Promise.all(names.map(function (n) {
          return new Promise(function (ok, fail) {
            var path = FIXED_FONTS.indexOf(n) >= 0 ? n : (set === 'ko' ? n.replace('NotoSansSC', 'NotoSansKR') : n) + "-" + set;
            resources.load("fonts/" + path, TTFFont, function (err, font) {
              if (err) fail(err);else {
                loaded[n] = font;
                ok();
              }
            });
          });
        })).then(function () {
          return warmFaces(names.map(function (n) {
            return loaded[n];
          }));
        }).then(function () {
          // The swap and the measure reset happen together, synchronously, and only if the switch is still wanted.
          if (still && !still()) throw new Error('superseded');
          for (var _iterator = _createForOfIteratorHelperLoose(names), _step; !(_step = _iterator()).done;) {
            var n = _step.value;
            fonts[n] = loaded[n];
          }
          installMeasure();
        });
      }
      // On the web a registered face is only fetched when text first asks for it; a label drawn before that (the picker's
      // Korean name, first used long after boot) is rasterised once with a system fallback. Load every face up front.
      function warmFaces(faces) {
        if (sys.isNative || typeof document === 'undefined' || !document.fonts || typeof document.fonts.load !== 'function') return Promise.resolve();
        return Promise.all(faces.map(function (face) {
          var css = cssFamily(face);
          return css ? document.fonts.load("20px \"" + css + "\"")["catch"](function () {
            return [];
          }) : Promise.resolve([]);
        })).then(function () {
          return undefined;
        });
      }
      function fontFor(family) {
        var _FAMILY_ASSET;
        return fonts[(_FAMILY_ASSET = FAMILY_ASSET[family != null ? family : 'sans']) != null ? _FAMILY_ASSET : FAMILY_ASSET.sans];
      }

      // Text measurement for ui/text.ts. On the web the TTF is registered as a CSS font; native builds measure with a
      // scratch Label instead (same metrics as the renderer).
      var measureCache = new Map();
      var scratch = null;
      // The CSS family the web renderer actually registered for a TTF: Cocos adds "_LABEL" to the asset's family name.
      // Measuring with the bare name silently used a fallback font (Latin text came out ~6% narrow and was clipped).
      var familyCache = new Map();
      function cssFamily(font) {
        if (!font) return undefined;
        if (familyCache.has(font)) return familyCache.get(font);
        var base = font._fontFamily;
        var found;
        // Native builds have a stub document.fonts (no FontFaceSet): they measure with a scratch Label instead.
        if (base && !sys.isNative && typeof document !== 'undefined' && document.fonts && typeof document.fonts.forEach === 'function') {
          document.fonts.forEach(function (face) {
            var f = face.family.replace(/^["']|["']$/g, '');
            if (!found && (f === base + '_LABEL' || f === base)) found = f;
          });
        }
        if (!found && !sys.isNative) console.warn('[UI] measuring font not registered:', base);
        familyCache.set(font, found);
        return found;
      }
      function installMeasure() {
        measureCache.clear(); // a language switch can change the faces behind a family (the Korean set)
        var ctx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
        setMeasure(function (text, size, family) {
          var key = family + "|" + size + "|" + text;
          var hit = measureCache.get(key);
          if (hit !== undefined) return hit;
          var px = size * PT;
          var w;
          var font = fontFor(family);
          var css = cssFamily(font);
          if (ctx && css) {
            ctx.font = px + "px \"" + css + "\"";
            w = ctx.measureText(text).width;
          } else {
            if (!scratch) {
              var n = new Node('measure');
              n.addComponent(UITransform);
              scratch = n.addComponent(Label);
              scratch.overflow = Label.Overflow.NONE;
            }
            scratch.font = font != null ? font : null;
            scratch.fontSize = px;
            scratch.lineHeight = px;
            scratch.string = text;
            scratch.updateRenderData(true);
            w = scratch.node.getComponent(UITransform).width;
          }
          measureCache.set(key, w);
          return w;
        });
      }
      // Layout check (port side of the Maker layout audit): labels whose text does not fit even at their minimum size.

      var overflows = exports('overflows', new Map());
      function noteOverflow(key, text, w, h, pt, need) {
        if (text.trim() === '' || w <= 0 || h <= 0) return;
        overflows.set(key, {
          text: text,
          w: +w.toFixed(1),
          h: +h.toFixed(1),
          pt: pt,
          need: +need.toFixed(1)
        });
      }
      // Width of text at pt in design units (same entry point as ui/text.ts; strips U+200B).
      function measure(text, pt, family) {
        if (family === void 0) {
          family = 'sans';
        }
        return textWidth(text, pt, family);
      }
      function color(c, fallback) {
        var _c$, _c$2, _c$3, _c$4;
        if (!c) return fallback;
        return new Color((_c$ = c[0]) != null ? _c$ : 0, (_c$2 = c[1]) != null ? _c$2 : 0, (_c$3 = c[2]) != null ? _c$3 : 0, (_c$4 = c[3]) != null ? _c$4 : 255);
      }
      var nextId = 0;
      var W = exports('W', /*#__PURE__*/function () {
        function W(kind, props) {
          if (props === void 0) {
            props = {};
          }
          this.node = void 0;
          this.props = void 0;
          this.children = [];
          this.parent = null;
          this.kind = void 0;
          this.bg = null;
          this.img = null;
          this.lbl = null;
          this.imagePath = void 0;
          this.imageFrame = null;
          this.touchBound = false;
          this.animation = null;
          this.renderProps_ = {};
          this.paintKey = '';
          this.textKey = '';
          this.kind = kind;
          this.node = new Node(kind + "#" + ++nextId + (props.id ? ':' + props.id : ''));
          this.node.layer = Layers.Enum.UI_2D;
          var t = this.node.addComponent(UITransform);
          t.setAnchorPoint(0, 1);
          this.node.addComponent(UIOpacity);
          var kids = props.children;
          var p = _extends({}, props);
          delete p.children;
          this.props = p;
          this.apply();
          for (var _iterator2 = _createForOfIteratorHelperLoose(kids != null ? kids : []), _step2; !(_step2 = _iterator2()).done;) {
            var c = _step2.value;
            this.AddChild(c);
          }
        }
        // ---- tree -------------------------------------------------------------------------------------------------
        var _proto = W.prototype;
        _proto.AddChild = function AddChild(child) {
          if (child.parent) child.parent.RemoveChild(child);
          child.parent = this;
          this.children.push(child);
          this.node.addChild(child.node);
          child.layout();
        };
        _proto.InsertChild = function InsertChild(child, index) {
          this.AddChild(child);
          this.children.splice(this.children.indexOf(child), 1);
          this.children.splice(index, 0, child);
          child.node.setSiblingIndex(this.firstChildIndex() + index);
        };
        _proto.RemoveChild = function RemoveChild(child) {
          var i = this.children.indexOf(child);
          if (i >= 0) {
            this.children.splice(i, 1);
            child.node.removeFromParent();
            child.parent = null;
          }
        };
        _proto.ClearChildren = function ClearChildren() {
          for (var _i = 0, _arr = [].concat(this.children); _i < _arr.length; _i++) {
            var c = _arr[_i];
            this.RemoveChild(c);
            c.node.destroy();
          }
        };
        _proto.Destroy = function Destroy() {
          var _this$animation, _this$parent;
          overflows["delete"](this.node.name);
          (_this$animation = this.animation) == null || _this$animation.stop();
          this.animation = null;
          (_this$parent = this.parent) == null || _this$parent.RemoveChild(this);
          this.node.destroy();
        };
        _proto.FindById = function FindById(id) {
          if (this.props.id === id) return this;
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.children), _step3; !(_step3 = _iterator3()).done;) {
            var c = _step3.value;
            var _f = c.FindById(id);
            if (_f) return _f;
          }
          return null;
        };
        _proto.firstChildIndex = function firstChildIndex() {
          return (this.bg ? 1 : 0) + (this.img ? 1 : 0) + (this.lbl ? 1 : 0);
        }
        // ---- style ------------------------------------------------------------------------------------------------
        ;

        _proto.SetStyle = function SetStyle(style) {
          Object.assign(this.props, style);
          this.apply();
          for (var _iterator4 = _createForOfIteratorHelperLoose(this.children), _step4; !(_step4 = _iterator4()).done;) {
            var c = _step4.value;
            c.layout();
          }
        };
        _proto.SetText = function SetText(text) {
          this.SetStyle({
            text: text
          });
        };
        _proto.SetDisabled = function SetDisabled(disabled) {
          this.SetStyle({
            disabled: disabled
          });
        };
        _proto.style = function style(k) {
          return this.renderProps_[k] !== undefined ? this.renderProps_[k] : this.props[k];
        };
        _proto.size = function size() {
          var _this$parent$size$wid, _this$parent2, _this$parent$size$hei, _this$parent3;
          var pw = (_this$parent$size$wid = (_this$parent2 = this.parent) == null ? void 0 : _this$parent2.size().width) != null ? _this$parent$size$wid : 360,
            ph = (_this$parent$size$hei = (_this$parent3 = this.parent) == null ? void 0 : _this$parent3.size().height) != null ? _this$parent$size$hei : 640;
          var dim = function dim(v, full) {
            return typeof v === 'number' ? v : typeof v === 'string' && v.endsWith('%') ? full * parseFloat(v) / 100 : undefined;
          };
          var w = dim(this.props.width, pw),
            h = dim(this.props.height, ph);
          if (w === undefined) w = this.props.left !== undefined && this.props.right !== undefined ? pw - this.props.left - this.props.right : this.parent ? pw : 360;
          if (h === undefined) h = this.props.top !== undefined && this.props.bottom !== undefined ? ph - this.props.top - this.props.bottom : this.parent ? ph : 640;
          return new Size(w, h);
        }
        // Position within the parent (design units, top-left origin), before scale.
        ;

        _proto.GetLayout = function GetLayout() {
          var _this$parent$size$wid2, _this$parent4, _this$parent$size$hei2, _this$parent5, _this$props$left, _this$props$top;
          var s = this.size();
          var pw = (_this$parent$size$wid2 = (_this$parent4 = this.parent) == null ? void 0 : _this$parent4.size().width) != null ? _this$parent$size$wid2 : 360,
            ph = (_this$parent$size$hei2 = (_this$parent5 = this.parent) == null ? void 0 : _this$parent5.size().height) != null ? _this$parent$size$hei2 : 640;
          var x = (_this$props$left = this.props.left) != null ? _this$props$left : this.props.right !== undefined ? pw - this.props.right - s.width : 0;
          var y = (_this$props$top = this.props.top) != null ? _this$props$top : this.props.bottom !== undefined ? ph - this.props.bottom - s.height : 0;
          return {
            x: x,
            y: y,
            w: s.width,
            h: s.height
          };
        }
        // Layout box in an ancestor's units, transforms ignored (urhox GetAbsoluteLayout differences such as
        // board.x - page.x are layout units; the Maker pages compute their effect positions this way). The one exception
        // is the tall-screen anchor groups' shift (D.AnchorGroup), which is layout: effects must aim at the moved plate.
        ;

        _proto.RectIn = function RectIn(ancestor) {
          var l = this.GetLayout();
          var x = l.x,
            y = l.y;
          var p = this.parent;
          while (p && p !== ancestor) {
            var _ref;
            var pl = p.GetLayout();
            x += pl.x;
            y += pl.y;
            if (p.props.anchor) y += (_ref = p.style('translateY')) != null ? _ref : 0;
            p = p.parent;
          }
          return {
            x: x,
            y: y,
            w: l.w,
            h: l.h
          };
        };
        _proto.GetAbsoluteLayout = function GetAbsoluteLayout() {
          var _this$parent$style;
          var l = this.GetLayout();
          if (!this.parent) return l;
          var p = this.parent.GetAbsoluteLayout();
          var sc = (_this$parent$style = this.parent.style('scale')) != null ? _this$parent$style : 1;
          return {
            x: p.x + l.x * sc,
            y: p.y + l.y * sc,
            w: l.w * sc,
            h: l.h * sc
          };
        };
        _proto.layout = function layout() {
          var _this$style, _ref2, _ref3, _this$style2, _this$style3, _this$style4;
          var l = this.GetLayout();
          var s = (_this$style = this.style('scale')) != null ? _this$style : 1;
          // scaleX / scaleY multiply the uniform scale (a port addition: the Maker cell flip scales the art render).
          var sx = s * ((_ref2 = this.style('scaleX')) != null ? _ref2 : 1),
            sy = s * ((_ref3 = this.style('scaleY')) != null ? _ref3 : 1);
          var tx = (_this$style2 = this.style('translateX')) != null ? _this$style2 : 0,
            ty = (_this$style3 = this.style('translateY')) != null ? _this$style3 : 0;
          var deg = (_this$style4 = this.style('rotate')) != null ? _this$style4 : 0;
          // urhox scales and rotates about the centre unless transformOrigin is top-left. The node's anchor is its
          // top-left corner, so place that corner where the transform about the origin puts it (y up, clockwise degrees).
          var origin = this.props.transformOrigin;
          var ox = origin === 'top-left' ? 0 : l.w / 2,
            oy = origin === 'top-left' || origin === 'top' ? 0 : l.h / 2;
          var vx = -ox * sx,
            vy = oy * sy,
            a = -deg * Math.PI / 180;
          var rx = vx * Math.cos(a) - vy * Math.sin(a),
            ry = vx * Math.sin(a) + vy * Math.cos(a);
          this.node.setPosition(new Vec3(l.x + ox + tx + rx, -(l.y + oy + ty) + ry, 0));
          this.node.setScale(sx, sy, 1);
          this.node.angle = -deg;
          this.node.getComponent(UITransform).setContentSize(l.w, l.h);
          // Background and label are redrawn only when something they show changed (animations restyle every frame).
          var key = l.w + "|" + l.h + "|" + this.style('backgroundColor') + "|" + this.props.borderWidth + "|" + this.props.borderColor + "|" + this.props.borderRadius;
          if (key !== this.paintKey) {
            this.paintKey = key;
            this.drawBackground(l.w, l.h);
          }
          this.placeImage(l.w, l.h);
          var p = this.props;
          var text = l.w + "|" + l.h + "|" + p.text + "|" + p.fontSize + "|" + p.fontColor + "|" + p.fontFamily + "|" + p.textAlign + "|" + p.verticalAlign + "|" + p.whiteSpace + "|" + p.minFontSize + "|" + p.letterSpacing + "|" + p.lineHeight + "|" + p.autoHeight;
          if (text !== this.textKey) {
            this.textKey = text;
            this.placeLabel(l.w, l.h);
          }
        };
        _proto.apply = function apply() {
          var op = this.style('opacity');
          var vis = this.style('visible');
          this.node.getComponent(UIOpacity).opacity = Math.round(255 * Math.max(0, Math.min(1, op != null ? op : 1)));
          this.node.active = vis !== false;
          var clip = this.props.overflow === 'hidden';
          var mask = this.node.getComponent(Mask);
          if (clip && !mask) this.node.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
          if (!clip && mask) mask.destroy();
          this.bindTouch();
          if (this.parent || !this.node.parent) this.layout();
        };
        _proto.ensureChild = function ensureChild(name) {
          var existing = this[name];
          if (existing) return existing;
          var n = new Node(name);
          n.layer = this.node.layer;
          n.addComponent(UITransform).setAnchorPoint(0, 1);
          this.node.addChild(n);
          var order = ['bg', 'img', 'lbl'];
          this[name] = n;
          var idx = 0;
          for (var _i2 = 0, _order = order; _i2 < _order.length; _i2++) {
            var o = _order[_i2];
            if (this[o]) {
              this[o].setSiblingIndex(idx);
              idx++;
            }
          }
          return n;
        };
        _proto.drawBackground = function drawBackground(w, h) {
          var _this$props$borderWid, _n$getComponent, _this$props$borderRad, _bgc$;
          var bgc = this.style('backgroundColor'),
            bw = (_this$props$borderWid = this.props.borderWidth) != null ? _this$props$borderWid : 0;
          if (!bgc && !bw) {
            var _this$bg$getComponent;
            if (this.bg) (_this$bg$getComponent = this.bg.getComponent(Graphics)) == null || _this$bg$getComponent.clear();
            return;
          }
          var n = this.ensureChild('bg');
          var g = (_n$getComponent = n.getComponent(Graphics)) != null ? _n$getComponent : n.addComponent(Graphics);
          g.clear();
          // borderRadius is one radius or urhox's per-corner {top-left, top-right, bottom-right, bottom-left}.
          var br = (_this$props$borderRad = this.props.borderRadius) != null ? _this$props$borderRad : 0;
          var corners = (typeof br === 'number' ? [br, br, br, br] : [0, 1, 2, 3].map(function (i) {
            var _br$i;
            return (_br$i = br[i]) != null ? _br$i : 0;
          })).map(function (r) {
            return Math.min(r, w / 2, h / 2);
          });
          var shape = function shape(inset) {
            var rs = corners.map(function (r) {
              return Math.max(0, r - inset);
            });
            var iw = w - 2 * inset,
              ih = h - 2 * inset;
            if (rs[0] === rs[1] && rs[1] === rs[2] && rs[2] === rs[3] && Math.abs(iw - ih) < .01 && rs[0] >= iw / 2 - .01) {
              // A full circle: Cocos roundRect leaves seams at the four arc joins.
              g.circle(w / 2, -h / 2, iw / 2);
            } else if (rs[0] === rs[1] && rs[1] === rs[2] && rs[2] === rs[3]) {
              if (rs[0] > 0) g.roundRect(inset, -h + inset, w - 2 * inset, h - 2 * inset, rs[0]);else g.rect(inset, -h + inset, w - 2 * inset, h - 2 * inset);
            } else roundRectCorners(g, inset, -inset, w - 2 * inset, h - 2 * inset, rs);
          };
          if (bgc && ((_bgc$ = bgc[3]) != null ? _bgc$ : 255) > 0) {
            g.fillColor = color(bgc, Color.TRANSPARENT);
            shape(0);
            g.fill();
          }
          // urhox borderAlign defaults to 'center': the stroke straddles the box edge.
          if (bw > 0) {
            g.lineWidth = bw;
            g.strokeColor = color(this.props.borderColor, Color.BLACK);
            shape(this.props.borderAlign === 'inside' ? bw / 2 : 0);
            g.stroke();
          }
        };
        _proto.placeImage = function placeImage(w, h) {
          var _n$getComponent2,
            _this = this;
          var path = this.style('backgroundImage');
          if (!path) {
            if (this.img) this.img.active = false;
            this.imagePath = path;
            return;
          }
          var n = this.ensureChild('img');
          n.active = true;
          var sprite = (_n$getComponent2 = n.getComponent(Sprite)) != null ? _n$getComponent2 : n.addComponent(Sprite);
          var slice = this.props.backgroundFit === 'sliced' ? this.props.backgroundSlice : undefined;
          // trim off: a frame imported trimmed still draws inside its full original box (Maker draws the whole image).
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.type = slice ? Sprite.Type.SLICED : Sprite.Type.SIMPLE;
          sprite.trim = false;
          var fit = function fit() {
            var _this$props$backgroun;
            var frame = sprite.spriteFrame;
            var t = n.getComponent(UITransform);
            var mode = (_this$props$backgroun = _this.props.backgroundFit) != null ? _this$props$backgroun : 'fill';
            if (!frame || mode === 'fill' || mode === 'sliced') {
              t.setContentSize(w, h);
              n.setPosition(0, 0);
              return;
            }
            var fw = frame.originalSize.width,
              fh = frame.originalSize.height;
            var k = _this.props.backgroundFit === 'cover' ? Math.max(w / fw, h / fh) : Math.min(w / fw, h / fh);
            t.setContentSize(fw * k, fh * k);
            n.setPosition((w - fw * k) / 2, -(h - fh * k) / 2);
          };
          // The frame may arrive later (native loads asynchronously): it is kept, and the widget lays out again then, so
          // the fit and slices use the size and props of that moment, not of the call that started the load.
          if (path !== this.imagePath) {
            this.imagePath = path;
            this.imageFrame = null;
            loadSpriteFrame(path, function (frame) {
              if (_this.imagePath !== path || !sprite.isValid) return;
              _this.imageFrame = frame;
              _this.layout();
            });
          }
          if (this.imageFrame) sprite.spriteFrame = slice ? slicedFrame(path, this.imageFrame, slice) : this.imageFrame;
          fit();
        };
        _proto.placeLabel = function placeLabel(w, h) {
          var _n$getComponent3, _this$props$fontFamil, _fontFor, _this$props$fontSize, _this$props$minFontSi, _ref4, _ref6;
          var text = this.props.text;
          if (this.kind !== 'Label' && text === undefined) return;
          var n = this.ensureChild('lbl');
          var label = (_n$getComponent3 = n.getComponent(Label)) != null ? _n$getComponent3 : n.addComponent(Label);
          var family = (_this$props$fontFamil = this.props.fontFamily) != null ? _this$props$fontFamil : 'sans';
          label.useSystemFont = false;
          label.font = (_fontFor = fontFor(family)) != null ? _fontFor : null;
          var value = String(text != null ? text : '').split('​').join('');
          // Auto-fit (urhox UI.defaultAutoFitText): shrink to the box width, never below minFontSize (9 pt default).
          var pt = (_this$props$fontSize = this.props.fontSize) != null ? _this$props$fontSize : 14;
          var min = Math.min(pt, (_this$props$minFontSi = this.props.minFontSize) != null ? _this$props$minFontSi : 9);
          // urhox UI.MeasureTextFit (single line): width <= box + 0.25 and the font's line box (NanoVG line height,
          // 1.448 em for NotoSansSC: hhea ascender 1160, descender -288) <= box height + 0.25.
          // The line box is the font's line height times the label's lineHeight (1.35 on the result details puts a
          // 22-unit amount in a 30-tall box down to ~15). Wrapped text fits all its lines.
          // autoHeight: the box height is the Yoga-measured text height, which never forces a smaller font.
          var lh = this.props.autoHeight ? 0 : (_ref4 = this.props.lineHeight) != null ? _ref4 : 1;
          if (this.props.whiteSpace !== 'normal') {
            var fits = function fits(q) {
              return measure(value, q, family) <= w + .25 && q * PT * LINE_EM * lh <= h + .25;
            };
            while (pt > min && !fits(pt)) pt = Math.max(min, pt - .25);
            // Reported only when it would show: wider than the box, or the glyphs (1 em) taller than it. The NanoVG line
            // box is taller than the ink, and the Maker accepts it over a box (a 9 pt label in a 14-tall chip).
            var need = measure(value, pt, family);
            if (need > w + .5 || pt * PT > h + .5) noteOverflow(this.node.name, value, w, h, pt, need);else overflows["delete"](this.node.name);
          } else {
            var _ref5;
            var lines = function lines(q) {
              return value.split('\n').reduce(function (n, part) {
                return n + Math.max(1, wrap(part, q, family, w + .25).length);
              }, 0);
            };
            var _fits = function _fits(q) {
              return lines(q) * q * PT * LINE_EM * lh <= h + .25;
            };
            while (pt > min && !_fits(pt)) pt = Math.max(min, pt - .25);
            // Wrapped text clips when its lines, at the line height the label draws with, outgrow the box.
            // A single line is judged like a nowrap label (its glyphs against the box).
            var _n = lines(pt);
            var drawn = _n === 1 ? pt * PT : _n * pt * PT * ((_ref5 = this.props.lineHeight) != null ? _ref5 : 1.3);
            if (!this.props.autoHeight && drawn > h + 1) noteOverflow(this.node.name, value, w, h, pt, drawn);else overflows["delete"](this.node.name);
          }
          label.fontSize = pt * PT;
          label.lineHeight = pt * PT * ((_ref6 = this.props.lineHeight) != null ? _ref6 : this.props.whiteSpace === 'normal' ? 1.3 : 1.15);
          label.string = value;
          label.color = color(this.props.fontColor, new Color(68, 51, 38, 255));
          label.horizontalAlign = this.props.textAlign === 'left' ? Label.HorizontalAlign.LEFT : this.props.textAlign === 'right' ? Label.HorizontalAlign.RIGHT : Label.HorizontalAlign.CENTER;
          label.verticalAlign = this.props.verticalAlign === 'top' ? Label.VerticalAlign.TOP : this.props.verticalAlign === 'bottom' ? Label.VerticalAlign.BOTTOM : Label.VerticalAlign.CENTER;
          label.overflow = Label.Overflow.CLAMP;
          label.enableWrapText = this.props.whiteSpace === 'normal';
          n.getComponent(UITransform).setContentSize(w, h);
          n.setPosition(0, 0);
        };
        _proto.bindTouch = function bindTouch() {
          var _this2 = this;
          if (this.touchBound || !this.props.onClick) return;
          this.touchBound = true;
          this.node.on(Node.EventType.TOUCH_START, function (e) {
            if (!_this2.props.disabled) _this2.onPointerDown(e);
          });
          this.node.on(Node.EventType.TOUCH_END, function (e) {
            _this2.onPointerUp(e);
            if (!_this2.props.disabled && _this2.props.onClick) _this2.props.onClick(_this2);
          });
          this.node.on(Node.EventType.TOUCH_CANCEL, function (e) {
            return _this2.onPointerCancel(e);
          });
        }
        // Stops taking touches (urhox pointerEvents 'none' on a closing overlay): touches pass to what is underneath.
        ;

        _proto.DisableInput = function DisableInput() {
          for (var _i3 = 0, _arr2 = [Node.EventType.TOUCH_START, Node.EventType.TOUCH_MOVE, Node.EventType.TOUCH_END, Node.EventType.TOUCH_CANCEL]; _i3 < _arr2.length; _i3++) {
            var _t = _arr2[_i3];
            this.node.off(_t);
          }
          this.touchBound = false;
          this.props.onClick = undefined;
        }
        // Hooks overridden by S.ImageButton (press feedback).
        ;

        _proto.onPointerDown = function onPointerDown(_e) {};
        _proto.onPointerUp = function onPointerUp(_e) {};
        _proto.onPointerCancel = function onPointerCancel(_e) {}
        // ---- animation ------------------------------------------------------------------------------------------
        ;

        _proto.Animate = function Animate(opts) {
          var _this$animation2,
            _this3 = this,
            _opts$delay;
          (_this$animation2 = this.animation) == null || _this$animation2.stop();
          var keys = Object.keys(opts.keyframes).map(Number).sort(function (a, b) {
            return a - b;
          });
          var frame = function frame(t) {
            var a = keys[0],
              b = keys[keys.length - 1];
            for (var i = 0; i < keys.length - 1; i++) if (t >= keys[i] && t <= keys[i + 1]) {
              a = keys[i];
              b = keys[i + 1];
              break;
            }
            var fa = opts.keyframes[a],
              fb = opts.keyframes[b];
            var u = b > a ? (t - a) / (b - a) : 1;
            var out = {};
            var allKeys = Object.keys(fa).concat(Object.keys(fb)).filter(function (k, i, all) {
              return all.indexOf(k) === i;
            });
            for (var _iterator5 = _createForOfIteratorHelperLoose(allKeys), _step5; !(_step5 = _iterator5()).done;) {
              var _k = _step5.value;
              var va = fa[_k],
                vb = fb[_k];
              if (typeof va === 'number' && typeof vb === 'number') out[_k] = va + (vb - va) * u;else out[_k] = u < 1 ? va != null ? va : vb : vb != null ? vb : va;
            }
            return out;
          };
          var ease = easing(opts.easing);
          var state = {
            t: 0
          };
          // A node destroyed with its page (or a parent) ends the animation; tweens are not tied to node lifetime.
          var step = function step() {
            if (!_this3.node.isValid) {
              var _this3$animation;
              (_this3$animation = _this3.animation) == null || _this3$animation.stop();
              _this3.animation = null;
              return;
            }
            _this3.renderProps_ = frame(ease(state.t));
            _this3.apply();
          };
          step();
          var tw = tween(state).delay((_opts$delay = opts.delay) != null ? _opts$delay : 0).to(opts.duration, {
            t: 1
          }, {
            onUpdate: step
          });
          if (opts.loop) tw = tween(state).repeatForever(tw.call(function () {
            state.t = 0;
          }));
          this.animation = tw.call(function () {
            if (!_this3.node.isValid) return;
            if (opts.fillMode === 'forwards' || opts.fillMode === 'both') _this3.renderProps_ = frame(1);else _this3.renderProps_ = {};
            _this3.apply();
            opts.onComplete == null || opts.onComplete();
          }).start();
        };
        _proto.StopAnimation = function StopAnimation() {
          var _this$animation3;
          (_this$animation3 = this.animation) == null || _this$animation3.stop();
          this.animation = null;
          this.renderProps_ = {};
          this.apply();
        };
        return W;
      }());

      // Rounded rectangle with its own radius per corner; (x, top) is the top-left corner in node units (y up).
      function roundRectCorners(g, x, top, w, h, r) {
        var k = .5523,
          bottom = top - h,
          right = x + w;
        var tl = r[0],
          tr = r[1],
          brr = r[2],
          bl = r[3];
        g.moveTo(x + tl, top);
        g.lineTo(right - tr, top);
        if (tr > 0) g.bezierCurveTo(right - tr + tr * k, top, right, top - tr + tr * k, right, top - tr);
        g.lineTo(right, bottom + brr);
        if (brr > 0) g.bezierCurveTo(right, bottom + brr - brr * k, right - brr + brr * k, bottom, right - brr, bottom);
        g.lineTo(x + bl, bottom);
        if (bl > 0) g.bezierCurveTo(x + bl - bl * k, bottom, x, bottom + bl - bl * k, x, bottom + bl);
        g.lineTo(x, top - tl);
        if (tl > 0) g.bezierCurveTo(x, top - tl + tl * k, x + tl - tl * k, top, x + tl, top);
        g.close();
      }
      function easing(name) {
        switch (name) {
          case 'easeOut':
          case 'easeOutCubic':
            return function (t) {
              return 1 - Math.pow(1 - t, 3);
            };
          case 'easeIn':
          case 'easeInCubic':
            return function (t) {
              return t * t * t;
            };
          case 'easeInOut':
          case 'easeInOutCubic':
            return function (t) {
              return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
          case 'easeOutBack':
            return function (t) {
              var c1 = 1.70158,
                c3 = c1 + 1;
              return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            };
          default:
            return function (t) {
              return t;
            };
        }
      }
      var frameCache = new Map();
      var pending = new Map();
      function loadSpriteFrame(path, done) {
        var hit = frameCache.get(path);
        if (hit) {
          done(hit);
          return;
        }
        var waiting = pending.get(path);
        if (waiting) {
          waiting.push(done);
          return;
        }
        pending.set(path, [done]);
        var key = path.replace(/\.(png|jpg|jpeg|webp)$/i, '') + '/spriteFrame';
        resources.load(key, SpriteFrame, function (err, frame) {
          var _pending$get;
          var cbs = (_pending$get = pending.get(path)) != null ? _pending$get : [];
          pending["delete"](path);
          if (err) {
            console.warn('[UI] image missing', path, err.message);
            return;
          }
          frameCache.set(path, frame);
          for (var _iterator6 = _createForOfIteratorHelperLoose(cbs), _step6; !(_step6 = _iterator6()).done;) {
            var cb = _step6.value;
            cb(frame);
          }
        });
      }

      // urhox backgroundSlice is {top, right, bottom, left} in source pixels, drawn at the same size in layout units; a
      // Cocos SLICED sprite does the same with the frame insets. Each slice set gets its own frame on the shared texture.
      var slicedCache = new Map();
      function slicedFrame(path, base, slice) {
        var _slice$, _slice$2, _slice$3, _slice$4;
        var key = path + '|' + slice.join(',');
        var hit = slicedCache.get(key);
        if (hit) return hit;
        var frame = new SpriteFrame();
        frame.reset({
          texture: base.texture,
          rect: base.rect.clone(),
          originalSize: base.originalSize.clone(),
          offset: base.offset.clone(),
          isRotate: base.rotated
        });
        frame.insetTop = (_slice$ = slice[0]) != null ? _slice$ : 0;
        frame.insetRight = (_slice$2 = slice[1]) != null ? _slice$2 : 0;
        frame.insetBottom = (_slice$3 = slice[2]) != null ? _slice$3 : 0;
        frame.insetLeft = (_slice$4 = slice[3]) != null ? _slice$4 : 0;
        slicedCache.set(key, frame);
        return frame;
      }

      // Vertical scroll view (urhox UI.ScrollView with scrollY, no bounce): children go into one content panel that moves
      // up by the offset; drag or mouse wheel scrolls; onScroll(view, 0, offset). The scrollbar is the urhox interactive
      // one (10 wide, 2 margin, grey thumb at least 30 tall over a faint track) whenever the content overflows.
      var _ScrollView = exports('ScrollView', /*#__PURE__*/function (_W) {
        _inheritsLoose(ScrollView, _W);
        function ScrollView(props) {
          var _props$children;
          var _this4;
          if (props === void 0) {
            props = {};
          }
          var kids = (_props$children = props.children) != null ? _props$children : [];
          var p = _extends({}, props, {
            overflow: 'hidden'
          });
          delete p.children;
          _this4 = _W.call(this, 'ScrollView', p) || this;
          _this4.content = void 0;
          _this4.offset = 0;
          _this4.track = void 0;
          _this4.thumb = void 0;
          _this4.dragY = null;
          _this4.dragOffset = 0;
          _this4.content = new W('Panel', {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 0,
            overflow: 'visible',
            pointerEvents: 'none'
          });
          _this4.AddChild(_this4.content);
          for (var _iterator7 = _createForOfIteratorHelperLoose(kids), _step7; !(_step7 = _iterator7()).done;) {
            var c = _step7.value;
            _this4.content.AddChild(c);
          }
          _this4.track = new W('Panel', {
            position: 'absolute',
            width: 10,
            borderRadius: 5,
            backgroundColor: [200, 200, 200, 30],
            pointerEvents: 'none',
            visible: false
          });
          _this4.thumb = new W('Panel', {
            position: 'absolute',
            width: 10,
            borderRadius: 5,
            backgroundColor: [128, 128, 128, 100],
            pointerEvents: 'none',
            visible: false
          });
          _this4.AddChild(_this4.track);
          _this4.AddChild(_this4.thumb);
          _this4.UpdateContentSize();
          _this4.node.on(Node.EventType.TOUCH_START, function (e) {
            _this4.dragY = e.getUILocation().y;
            _this4.dragOffset = _this4.offset;
          });
          _this4.node.on(Node.EventType.TOUCH_MOVE, function (e) {
            if (_this4.dragY === null) return;
            _this4.SetScrollY(_this4.dragOffset + (e.getUILocation().y - _this4.dragY) / _this4.worldScale());
          });
          var end = function end() {
            _this4.dragY = null;
          };
          _this4.node.on(Node.EventType.TOUCH_END, end);
          _this4.node.on(Node.EventType.TOUCH_CANCEL, end);
          _this4.node.on(Node.EventType.MOUSE_WHEEL, function (e) {
            return _this4.SetScrollY(_this4.offset - e.getScrollY() / 120 * 40);
          });
          return _this4;
        }
        // UI location is in design units of the canvas; the page itself may be scaled into the safe area.
        var _proto2 = ScrollView.prototype;
        _proto2.worldScale = function worldScale() {
          var k = 1;
          var n = this.node.parent;
          while (n && n !== director.getScene()) {
            k *= n.scale.y;
            n = n.parent;
          }
          return k || 1;
        }
        // Content height is the bottom edge of the lowest child of the content panel.
        ;

        _proto2.GetContentSize = function GetContentSize() {
          var h = 0;
          for (var _iterator8 = _createForOfIteratorHelperLoose(this.content.children), _step8; !(_step8 = _iterator8()).done;) {
            var c = _step8.value;
            var l = c.GetLayout();
            h = Math.max(h, l.y + l.h);
          }
          return [this.size().width, h];
        };
        _proto2.UpdateContentSize = function UpdateContentSize() {
          var _this$GetContentSize = this.GetContentSize(),
            ch = _this$GetContentSize[1];
          this.content.SetStyle({
            height: ch
          });
          this.SetScrollY(this.offset, true);
        };
        _proto2.SetScrollbarColors = function SetScrollbarColors(track, thumb) {
          this.track.SetStyle({
            backgroundColor: track
          });
          this.thumb.SetStyle({
            backgroundColor: thumb
          });
        };
        _proto2.ScrollToBottom = function ScrollToBottom() {
          this.SetScrollY(this.MaxScroll());
        };
        _proto2.MaxScroll = function MaxScroll() {
          return Math.max(0, this.GetContentSize()[1] - this.size().height);
        };
        _proto2.SetScrollY = function SetScrollY(value, silent) {
          if (silent === void 0) {
            silent = false;
          }
          var max = this.MaxScroll();
          var next = Math.max(0, Math.min(max, value));
          var changed = next !== this.offset;
          this.offset = next;
          this.content.SetStyle({
            top: -next
          });
          var s = this.size(),
            ch = this.GetContentSize()[1];
          var show = this.props.showScrollbar !== false && ch > s.height;
          var trackH = s.height - 4,
            barH = Math.max(30, trackH * s.height / Math.max(1, ch));
          var barY = 2 + (trackH - barH) * (max > 0 ? next / max : 0);
          this.track.SetStyle({
            visible: show,
            left: s.width - 12,
            top: 2,
            height: trackH
          });
          this.thumb.SetStyle({
            visible: show,
            left: s.width - 12,
            top: barY,
            height: barH
          });
          var onScroll = this.props.onScroll;
          if (!silent && changed && onScroll) onScroll(this, 0, next);
        };
        return ScrollView;
      }(W));
      var UI = exports('UI', {
        Panel: function Panel(p) {
          if (p === void 0) {
            p = {};
          }
          return new W('Panel', p);
        },
        Label: function Label(p) {
          if (p === void 0) {
            p = {};
          }
          return new W('Label', p);
        },
        Button: function Button(p) {
          if (p === void 0) {
            p = {};
          }
          return new W('Button', p);
        },
        ScrollView: function ScrollView(p) {
          if (p === void 0) {
            p = {};
          }
          return new _ScrollView(p);
        }
      });
      function resolve(id) {
        return resolveAsset(id);
      }
      function currentScene() {
        return director.getScene();
      }

      // A panel drawn from rectangles of one image: each strip shows the texture sub-rectangle (texture pixels, top-left
      // origin) at the given design rectangle and opacity. Used where the Maker pages paint image patterns with NanoVG
      // (the cat house title region remaps part of the scene with faded edges).
      function ImageStrips(path, x, y, w, h, strips) {
        var root = UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          pointerEvents: 'none'
        });
        loadSpriteFrame(path, function (base) {
          if (!root.node.isValid) return;
          for (var _iterator9 = _createForOfIteratorHelperLoose(strips), _step9; !(_step9 = _iterator9()).done;) {
            var s = _step9.value;
            var n = new Node('strip');
            n.layer = root.node.layer;
            var _t2 = n.addComponent(UITransform);
            _t2.setAnchorPoint(0, 1);
            _t2.setContentSize(s.w, s.h);
            n.setPosition(s.x, -s.y, 0);
            var frame = new SpriteFrame();
            frame.reset({
              texture: base.texture,
              rect: new Rect(base.rect.x + s.sx, base.rect.y + s.sy, s.sw, s.sh),
              originalSize: new Size(s.sw, s.sh),
              isRotate: false
            });
            var sprite = n.addComponent(Sprite);
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = frame;
            sprite.color = new Color(255, 255, 255, Math.round(255 * s.alpha));
            root.node.addChild(n);
          }
        });
        return root;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/language.ts", ['cc', './i18n.ts', './kit.ts'], function (exports) {
  var cclegacy, resources, JsonAsset, fontSetFor, setLanguage, loadFonts;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      resources = module.resources;
      JsonAsset = module.JsonAsset;
    }, function (module) {
      fontSetFor = module.fontSetFor;
      setLanguage = module.setLanguage;
    }, function (module) {
      loadFonts = module.loadFonts;
    }],
    execute: function () {
      exports({
        applyLanguage: applyLanguage,
        cancelLanguageSwitch: cancelLanguageSwitch,
        languageName: languageName
      });
      cclegacy._RF.push({}, "33940UiLDRJnqvgMj42py1+", "language", undefined);
      var port = null;
      // Each switch gets a number; a load that finishes after a newer switch (or a cancel) is thrown away, never applied.
      var generation = 0;
      function loadJson(path) {
        return new Promise(function (ok) {
          return resources.load(path, JsonAsset, function (err, asset) {
            if (err) console.warn('[Language] missing', path, err.message);
            ok(err ? null : asset.json);
          });
        });
      }

      // The language's own name ("日本語"), drawn with the fixed 'names' fonts (ui/kit.ts).
      function languageName(code) {
        var _port$names$code, _port;
        return (_port$names$code = (_port = port) == null ? void 0 : _port.names[code]) != null ? _port$names$code : code;
      }

      // A switch still loading (a stalled request) is dropped: whatever arrives later changes nothing.
      function cancelLanguageSwitch() {
        generation++;
      }

      // Boot is lenient (a missing table shows the source text rather than no game); a switch from the picker is strict:
      // it rejects without touching the current language unless the table, the port-only copy and the fonts all loaded.
      function applyLanguage(lang, strict) {
        if (strict === void 0) {
          strict = false;
        }
        var mine = ++generation;
        var current = function current() {
          return mine === generation;
        };
        var table = lang === 'zh_CN' ? Promise.resolve(null) : loadJson('i18n/' + lang);
        var extra = port ? Promise.resolve(port) : loadJson('i18n/port-strings');
        return Promise.all([table, extra]).then(function (_ref) {
          var t = _ref[0],
            p = _ref[1];
          if (strict && lang !== 'zh_CN' && !t) throw new Error('no table for ' + lang);
          if (strict && !p) throw new Error('no port strings');
          if (!current()) throw new Error('superseded');
          // loadFonts swaps the faces only while this switch is current, in the same synchronous step as what follows.
          return loadFonts(fontSetFor(lang), current).then(function () {
            var _ref2;
            port = (_ref2 = p) != null ? _ref2 : port;
            var merged = t;
            if (lang !== 'zh_CN' && port) {
              var _merged;
              merged = Object.assign({}, (_merged = merged) != null ? _merged : {});
              for (var _i = 0, _Object$keys = Object.keys(port.strings); _i < _Object$keys.length; _i++) {
                var key = _Object$keys[_i];
                var v = port.strings[key][lang];
                if (v) merged[key] = v;
              }
            }
            setLanguage(lang, merged);
            console.log('[Language]', lang);
          });
        });
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loadError.ts", ['cc', './kit.ts', './skin.ts', './paper.ts', './i18n.ts', './text.ts'], function (exports) {
  var cclegacy, UI, PT, Image, Text, ink, Block, ImageButton, FaceText, Paper, L, phraseLines, wrap;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
      PT = module.PT;
    }, function (module) {
      Image = module.Image;
      Text = module.Text;
      ink = module.ink;
      Block = module.Block;
      ImageButton = module.ImageButton;
      FaceText = module.FaceText;
    }, function (module) {
      Paper = module.Paper;
    }, function (module) {
      L = module.L;
    }, function (module) {
      phraseLines = module.phraseLines;
      wrap = module.wrap;
    }],
    execute: function () {
      exports({
        Close: Close,
        Open: Open
      });
      cclegacy._RF.push({}, "646c34y/i5FqpUXQpe7CRFO", "loadError", undefined);
      var ZW = '​';
      function Close(app) {
        var _app$refs$loadErrorNo;
        (_app$refs$loadErrorNo = app.refs.loadErrorNotice) == null || _app$refs$loadErrorNo.Destroy();
        app.refs.loadErrorNotice = undefined;
        app.loadErrorAcknowledged = app.profile;
      }
      function Open(app) {
        if (!app.profile.loadError || app.loadErrorAcknowledged === app.profile) return;
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundColor: [47, 32, 20, 89],
          onClick: function onClick() {}
        });
        var card = UI.Panel({
          position: 'absolute',
          left: 35,
          top: 175,
          width: 290,
          height: 290
        });
        var paper = Paper('ui.tips.card', 290, 290);
        // The paper's inner edge belongs to the fixed slices; 48 cuts through its rounded corners.
        var plate = paper.children[0];
        plate == null || plate.SetStyle({
          backgroundSlice: [96, 96, 96, 96]
        });
        card.AddChild(paper);
        root.AddChild(card);
        card.AddChild(Image('ui.notice.nail', 133, -12, 24, 24));
        card.AddChild(Image('ui.icon.sad_paw', 113, 20, 64, 64));
        card.AddChild(Text(L('存档没有读到'), 20, 22, 90, 246, 36, ink));
        var raw = app.profile.loadError;
        var reason = typeof raw !== 'string' || !/\S/.test(raw) ? L('网络或存档' + ZW + '出了点问题，' + ZW + '这次不能开店营业') : L(raw);
        var size = 14,
          pitch = 26;
        var packed = phraseLines(reason, size, 'body', 246);
        var _S$Block = Block(packed, size, 22, 130, 246, ink, 'body', 'center', pitch / (size * PT), undefined, size),
          block = _S$Block[0],
          count = _S$Block[2];
        // Grow the same card for long reasons, keeping its normal rows and the page safe area.
        // The action line ("Please quit and open the game again") wraps in longer languages; the card grows by those rows.
        var actionCopy = L('请退出游戏后' + ZW + '重新进入');
        var actionLines = wrap(phraseLines(actionCopy, size, 'body', 246), size, 'body', 246 * .95);
        var actionExtra = (actionLines.length - 1) * pitch;
        var extra = Math.min(286, Math.max(0, count - 2) * pitch) + actionExtra;
        var cardH = 290 + extra;
        card.SetStyle({
          top: (640 - cardH) / 2,
          height: cardH
        });
        paper.SetStyle({
          height: cardH
        });
        plate == null || plate.SetStyle({
          height: cardH / (290 / plate.props.width)
        });
        block.children.forEach(function (line, i) {
          return line.SetStyle({
            top: i * pitch,
            height: pitch,
            minFontSize: size
          });
        });
        if (count * pitch <= 52 + extra - actionExtra) {
          actionLines.forEach(function (line, i) {
            var t = Text(line, size, 0, (count + i) * pitch, 246, pitch, ink, 'center', 'body');
            t.SetStyle({
              minFontSize: size
            });
            block.AddChild(t);
          });
          block.SetStyle({
            height: (count + actionLines.length) * pitch,
            top: 130 + Math.max(0, 2 - count) * pitch / 2
          });
          card.AddChild(block);
        } else {
          // An unbounded external error can exceed the tallest safe card: every row stays reachable by scrolling. The
          // 222-wide reason column is centred on the card and ends where the scroll track begins.
          block.Destroy();
          var _S$Block2 = Block(reason, size, 0, 0, 222, ink, 'body', 'center', pitch / (size * PT), undefined, size);
          block = _S$Block2[0];
          count = _S$Block2[2];
          block.SetStyle({
            height: count * pitch
          });
          block.children.forEach(function (line, i) {
            return line.SetStyle({
              top: i * pitch,
              height: pitch,
              minFontSize: size
            });
          });
          var view = UI.ScrollView({
            position: 'absolute',
            left: 34,
            top: 130,
            width: 234,
            height: 52 + extra - actionExtra,
            showScrollbar: true,
            children: [block]
          });
          // A visible warm track and a dark warm thumb on this paper (the library grey nearly matched the track).
          view.SetScrollbarColors([214, 196, 166, 255], [112, 80, 52, 255]);
          card.AddChild(view);
          app.refs.loadErrorScroll = view;
          actionLines.forEach(function (line, i) {
            var t = Text(line, size, 22, 182 + extra - actionExtra + i * pitch, 246, pitch, ink, 'center', 'body');
            t.SetStyle({
              minFontSize: size
            });
            card.AddChild(t);
          });
        }
        app.refs.loadErrorText = block;
        var _S$ImageButton = ImageButton('ui.item_overlay.button.primary', 70, 216 + extra, 150, 44, function () {
            return Close(app);
          }),
          button = _S$ImageButton[0],
          hit = _S$ImageButton[1],
          face = _S$ImageButton[2];
        face.AddChild(FaceText('ui.item_overlay.button.primary', 0, 0, 150, 44, L('知道了'), 18, ink));
        card.AddChild(button);
        app.page.AddChild(root);
        app.refs.loadErrorNotice = root;
        app.refs.loadErrorClose = hit;
        app.refs.loadErrorCard = card;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/loading.ts", ['cc', './kit.ts', './skin.ts', './design.ts', './config.ts', './assets.ts', './i18n.ts', './text.ts'], function (exports) {
  var cclegacy, view, sys, Node, assetManager, resources, loadSpriteFrame, PT, UI, Text, Image, FaceText, ImageButton, colors, DAILY_BONUS, RELEASE_CAT_IDS, resolveAsset, L, textWidth, wrap, phraseLines;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      view = module.view;
      sys = module.sys;
      Node = module.Node;
      assetManager = module.assetManager;
      resources = module.resources;
    }, function (module) {
      loadSpriteFrame = module.loadSpriteFrame;
      PT = module.PT;
      UI = module.UI;
    }, function (module) {
      Text = module.Text;
      Image = module.Image;
      FaceText = module.FaceText;
      ImageButton = module.ImageButton;
    }, function (module) {
      colors = module.colors;
    }, function (module) {
      DAILY_BONUS = module.DAILY_BONUS;
      RELEASE_CAT_IDS = module.RELEASE_CAT_IDS;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      L = module.L;
    }, function (module) {
      textWidth = module.textWidth;
      wrap = module.wrap;
      phraseLines = module.phraseLines;
    }],
    execute: function () {
      exports({
        Active: Active,
        Finish: Finish,
        Prefetch: Prefetch,
        Prepare: Prepare,
        ProfileDone: ProfileDone,
        Retry: Retry,
        Start: Start,
        Tips: Tips,
        Update: Update
      });
      cclegacy._RF.push({}, "15e8bIehdZBhLqSlpYOldtf", "loading", undefined);
      var INK = [60, 32, 15, 255];
      var ZW = '​';
      var state;
      function statusCopy(phase) {
        if (phase === 'failed') return L('网络不太好，货还没搬完');
        if (phase === 'profile') return L('正在打开猫咪的小账本…').split('…').join('');
        return L('正在搬货…').split('…').join('');
      }
      // Short rule tips (the handbook's own short sentences, docs/ui/rules.md).
      function Tips() {
        return [L('小贴士：{0}', L('交换相邻商品，三个一样就会消除。')), L('小贴士：{0}', L('四件一样的商品连成一排，会留下一个线消。')), L('小贴士：{0}', L('摆成 T 字形或 L 字形，会留下一枚炸弹。')), L('小贴士：{0}', L('暂停和挑道具的时候，倒计时不会走。')), L('小贴士：{0}', L('每天第一次结算，额外送 {0} 养猫积分。', DAILY_BONUS))];
      }
      // Source-sized 9-slice, then uniformly scaled; face = the paper's safe area in layout units.
      function paper(id, x, y, w, h) {
        var asset = resolveAsset(id);
        if (!asset) throw new Error('Missing loading paper: ' + id);
        var k = w / asset.width,
          sa = asset.safeArea,
          sl = asset.slices;
        var panel = UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          pointerEvents: 'none'
        });
        panel.face = [sa[0] * w, sa[1] * asset.height * k, sa[2] * w, sa[3] * asset.height * k];
        panel.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: asset.width,
          height: h / k,
          scale: k,
          transformOrigin: 'top-left',
          backgroundImage: asset.path,
          backgroundFit: 'sliced',
          backgroundSlice: [sl[1], sl[2], sl[3], sl[0]],
          pointerEvents: 'none'
        }));
        return panel;
      }
      // Fit all three stages once; the dots take their own fixed slots outside the centred text.
      function buildStatus(panel) {
        var face = panel.face;
        var pw = panel.props.width,
          ph = panel.props.height;
        var w = pw - face[0] - face[2] - 12,
          h = ph - face[1] - face[3];
        var size = 18;
        while (size > 11) {
          var fits = true;
          for (var _i = 0, _arr = ['downloading', 'profile', 'failed']; _i < _arr.length; _i++) {
            var phase = _arr[_i];
            var text = statusCopy(phase);
            var extra = phase !== 'failed' ? 2 * textWidth('...', size, 'boot-sans') + 4 : 0;
            if (textWidth(text, size, 'boot-sans') + extra > w * .92 || size * PT * 1.35 > h) fits = false;
          }
          if (fits) break;
          size = Math.max(11, size - .5);
        }
        panel.copy = UI.Panel({
          position: 'absolute',
          left: face[0] + 6,
          top: face[1],
          width: w,
          height: h,
          pointerEvents: 'none'
        });
        panel.label = Text('', size, 0, 0, w, h, INK, 'center', 'boot-sans');
        panel.label.SetStyle({
          minFontSize: size
        });
        panel.copy.AddChild(panel.label);
        var slot = textWidth('.', size, 'boot-sans');
        panel.dots = [0, 1, 2].map(function () {
          var d = Text('.', size, 0, 0, slot + 1, h, INK, 'left', 'boot-sans');
          d.SetStyle({
            minFontSize: size
          });
          panel.copy.AddChild(d);
          return d;
        });
        panel.AddChild(panel.copy);
      }
      // Centre every line on the paper face, shrink before wrapping, never below 11.
      function setCopy(panel, value, sizeIn, family) {
        var _panel$copy;
        var face = panel.face;
        var w = panel.props.width - face[0] - face[2] - 12,
          h = panel.props.height - face[1] - face[3];
        var size = sizeIn;
        while (size > 11 && textWidth(value, size, family) > w * .92) size = Math.max(11, size - .5);
        var marked = value.split('，').join('，' + ZW);
        var wrapAt = function wrapAt(q) {
          return wrap(phraseLines(marked, q, family, w * .95), q, family, w * .95);
        };
        var lines = wrapAt(size);
        while (size > 11 && lines.length * size * PT * 1.35 > h) {
          size = Math.max(11, size - .5);
          lines = wrapAt(size);
        }
        var lh = size * PT * 1.35;
        (_panel$copy = panel.copy) == null || _panel$copy.Destroy();
        var block = UI.Panel({
          position: 'absolute',
          left: face[0] + 6,
          top: face[1] + (h - lines.length * lh) / 2,
          width: w,
          height: lines.length * lh,
          pointerEvents: 'none'
        });
        lines.forEach(function (line, i) {
          var t = Text(line, size, 0, i * lh, w, lh, INK, 'center', family);
          t.SetStyle({
            minFontSize: 11
          });
          block.AddChild(t);
        });
        panel.copy = block;
        panel.AddChild(block);
      }
      function fit() {
        if (!state) return;
        var vs = view.getVisibleSize(),
          safe = sys.getSafeAreaRect();
        var x = safe.x,
          w = safe.width,
          h = safe.height,
          top = vs.height - (safe.y + safe.height);
        var k = Math.max(0, Math.min(1, w / 360, h / 640));
        if (k === 0) return;
        var left = x + (w - 360 * k) / 2;
        state.holder.setPosition(-vs.width / 2, vs.height / 2, 0);
        state.root.SetStyle({
          width: vs.width,
          height: vs.height
        });
        state.page.SetStyle({
          position: 'absolute',
          left: left,
          top: top + (h - 640 * k) / 2,
          width: 360,
          height: 640,
          scale: k,
          transformOrigin: 'top-left'
        });
        // The shell's page width; tall phones keep the full-height cover.
        state.refs.bg.SetStyle({
          left: left,
          top: 0,
          width: 360 * k,
          height: vs.height
        });
      }
      function build(canvas) {
        var st = state;
        var vs = view.getVisibleSize();
        st.holder = new Node('Loading');
        st.holder.layer = canvas.layer;
        canvas.addChild(st.holder);
        st.holder.setPosition(-vs.width / 2, vs.height / 2, 0);
        var root = UI.Panel({
          width: vs.width,
          height: vs.height,
          overflow: 'hidden',
          backgroundColor: colors.pageOutside,
          onClick: function onClick() {}
        });
        st.holder.addChild(root.node);
        // Wide screens show the loading art's blurred copy beside it.
        var fillAsset = resolveAsset('ui.fill.loading');
        root.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backgroundColor: colors.pageOutside,
          backgroundImage: fillAsset ? fillAsset.path : null,
          backgroundFit: 'cover'
        }));
        var bgAsset = resolveAsset('ui.loading.bg');
        var bg = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundImage: bgAsset ? bgAsset.path : null,
          backgroundFit: 'cover',
          pointerEvents: 'none'
        });
        root.AddChild(bg);
        var page = UI.Panel({
          position: 'absolute',
          width: 360,
          height: 640,
          overflow: 'visible'
        });
        root.AddChild(page);
        st.root = root;
        st.page = page;
        // Keep the supplied transparent padding.
        var sign = Image('ui.loading.sign', -10, 0, 380, 380 * 480 / 900);
        sign.SetStyle({
          transformOrigin: 'top'
        });
        sign.AddChild(FaceText('ui.loading.sign', 0, 0, 380, 380 * 480 / 900, L('猫猫好运铺'), 30.5, INK, 'center', 'boot-sans', 8));
        page.AddChild(sign);
        var cart = Image('ui.loading.cat_cart', 6, 209, 222, 155.4),
          flag = Image('ui.loading.cat_flag', 215, 203, 143, 182);
        page.AddChild(cart);
        page.AddChild(flag);
        var trackW = 240;
        var track = Image('ui.loading.bar_track', 11, 384, trackW, trackW * 90 / 780);
        var sa = resolveAsset('ui.loading.bar_track').safeArea;
        var trackH = trackW * 90 / 780;
        st.fillLeft = sa[0] * trackW;
        st.fillWidth = trackW * (1 - sa[0] - sa[2]);
        var troughY = sa[1] * trackH,
          troughH = trackH * (1 - sa[1] - sa[3]);
        var clip = UI.Panel({
          position: 'absolute',
          left: st.fillLeft,
          top: troughY,
          width: 0,
          height: troughH,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        clip.AddChild(Image('ui.loading.bar_fill', -5, -2, st.fillWidth + 10, troughH + 4));
        track.AddChild(clip);
        var yarn = Image('ui.loading.yarn', st.fillLeft - 14, (trackH - 28) / 2, 28, 28);
        track.AddChild(yarn);
        page.AddChild(track);
        var tagH = 102 * 96 / 168;
        var tag = Image('ui.loading.tag', 252, 384 + (trackH - tagH) / 2, 102, tagH);
        var percent = Text(L('{0}%', 0), 15, 14, 6, 74, tagH - 12, INK, 'center', 'boot-sans');
        // Fit the longest value once, then lock the size for 0..100.
        var percentSize = 15;
        while (textWidth(L('{0}%', 100), percentSize, 'boot-sans') > 74) percentSize -= .5;
        percent.SetStyle({
          fontSize: percentSize,
          minFontSize: percentSize
        });
        tag.AddChild(percent);
        page.AddChild(tag);
        var status = paper('ui.loading.status_paper', 62, 430, 236, 48);
        buildStatus(status);
        page.AddChild(status);
        var tip = paper('ui.loading.tip_paper', 5, 570, 350, 68);
        page.AddChild(tip);
        var _S$ImageButton = ImageButton('ui.result.button.primary', 112, 482, 136, 44, function () {
            return Retry();
          }),
          retry = _S$ImageButton[0],
          retryFace = _S$ImageButton[2];
        retryFace.AddChild(FaceText('ui.result.button.primary', 0, 0, 136, 44, L('重试'), 18, INK, 'center', 'boot-sans'));
        retry.SetStyle({
          visible: false
        });
        page.AddChild(retry);
        st.refs = {
          bg: bg,
          sign: sign,
          cart: cart,
          flag: flag,
          track: track,
          clip: clip,
          yarn: yarn,
          tag: tag,
          percent: percent,
          status: status,
          tip: tip,
          retry: retry
        };
        // The bottom tip sits 6% above the page bottom.
        tip.SetStyle({
          top: Math.floor(640 * .94 - 68 - 1)
        });
        setCopy(tip, st.tips[st.tipIndex], 14, 'boot-body');
        fit();
        refresh();
      }
      function refresh() {
        var st = state;
        if (!st) return;
        var refs = st.refs,
          panel = refs.status;
        var value = statusCopy(st.phase);
        if (value !== st.copy) {
          st.copy = value;
          panel.label.SetText(value);
          var size = panel.label.props.fontSize;
          var right = panel.copy.props.width / 2 + textWidth(value, size, 'boot-sans') / 2 + 2;
          var slot = textWidth('.', size, 'boot-sans');
          panel.dots.forEach(function (dot, i) {
            return dot.SetStyle({
              left: right + i * slot
            });
          });
        }
        var count = Math.floor(st.time / .35) % 3 + 1;
        panel.dots.forEach(function (dot, i) {
          return dot.SetStyle({
            visible: st.phase !== 'failed' && i < count
          });
        });
        refs.retry.SetStyle({
          visible: st.phase === 'failed'
        });
        refs.clip.SetStyle({
          width: st.fillWidth * st.display
        });
        refs.yarn.SetStyle({
          left: st.fillLeft + st.fillWidth * st.display - 14,
          rotate: st.fillWidth * st.display / 14 * 180 / Math.PI
        });
        refs.percent.SetText(L('{0}%', Math.floor(st.display * 100 + .0001)));
      }

      // A group is the resources under a folder whose path starts with a prefix (the cat clips are folders named
      // animations/cat.<id>.<clip>). Preloaded one after another; progress is weighted by item count.
      function groupItems(group) {
        var slash = group.indexOf('/');
        var dir = slash < 0 ? group : group.slice(0, slash);
        return resources.getDirWithPath(dir).filter(function (info) {
          return info.path.startsWith(group);
        }).map(function (info) {
          return {
            uuid: info.uuid
          };
        });
      }
      function download() {
        var st = state;
        st.phase = 'downloading';
        st.done = false;
        refresh();
        console.log('[Loading] download begin', st.groups.join(','));
        var items = st.groups.map(groupItems);
        var total = Math.max(1, items.reduce(function (a, b) {
          return a + b.length;
        }, 0));
        var doneBefore = 0,
          index = 0;
        var next = function next() {
          if (state !== st || st.phase !== 'downloading') return;
          if (index >= items.length) {
            st.target = 1;
            st.done = true;
            console.log('[Loading] download complete');
            refresh();
            return;
          }
          var list = items[index];
          assetManager.preloadAny(list, {
            bundle: 'resources'
          }, function (finished, count) {
            if (state !== st) return;
            st.target = Math.max(st.target, Math.min(1, (doneBefore + list.length * (count > 0 ? finished / count : 1)) / total));
          }, function (err) {
            if (state !== st || st.phase !== 'downloading') return;
            if (err) {
              st.phase = 'failed';
              console.log('[Loading] failed', st.groups[index], err.message);
              refresh();
              return;
            }
            doneBefore += list.length;
            index++;
            next();
          });
        };
        next();
      }
      function Retry() {
        if (!state || state.phase !== 'failed') return false;
        console.log('[Loading] retry');
        download();
        return true;
      }
      // The page's own art (approved boot art) loads before it is shown, ahead of the preload queue.
      var BOOT_ART = ['ui.fill.loading', 'ui.loading.bg', 'ui.loading.sign', 'ui.loading.cat_cart', 'ui.loading.cat_flag', 'ui.loading.bar_track', 'ui.loading.bar_fill', 'ui.loading.yarn', 'ui.loading.tag', 'ui.loading.status_paper', 'ui.loading.tip_paper', 'ui.result.button.primary'];
      function Prepare() {
        return Promise.all(BOOT_ART.map(function (id) {
          return new Promise(function (ok) {
            var asset = resolveAsset(id);
            if (!asset) {
              ok();
              return;
            }
            // A missing image must not hold the boot: give up on it after 5 seconds.
            var timer = setTimeout(ok, 5000);
            loadSpriteFrame(asset.path, function () {
              clearTimeout(timer);
              ok();
            });
          });
        })).then(function () {
          return undefined;
        });
      }
      // Starts the page over the canvas; groups for the first launch come with ProfileDone.
      function Start(canvas, onReady) {
        state = {
          phase: 'profile',
          target: 0,
          display: 0,
          time: 0,
          tipIndex: 0,
          tips: Tips(),
          done: false,
          nextLog: 25,
          groups: [],
          onReady: onReady
        };
        console.log('[Loading] enter; profile begin');
        build(canvas);
      }
      function ProfileDone(equipped, err) {
        if (!state || state.phase !== 'profile') return;
        console.log('[Loading] profile complete' + (err ? '; failed, default lineup' : ''));
        state.groups = ['image', 'audio'].concat(equipped.map(function (id) {
          return 'animations/cat.' + id + '.';
        }));
        download();
      }
      // The other released cats in the background, after the home page is up.
      function Prefetch(equipped) {
        var others = RELEASE_CAT_IDS.filter(function (id) {
          return !equipped.includes(id);
        });
        var i = 0;
        var next = function next() {
          if (i < others.length) assetManager.preloadAny(groupItems('animations/cat.' + others[i++] + '.'), {
            bundle: 'resources'
          }, null, function () {
            return next();
          });else console.log('[Loading] background complete');
        };
        next();
      }
      // Fades the page out over the mounted home page, then removes it.
      function Finish() {
        var st = state;
        if (!st) return;
        state = undefined;
        // The home page mounted its own root after this one; stay on top while fading.
        st.holder.setSiblingIndex(st.holder.parent.children.length - 1);
        st.root.Animate({
          keyframes: {
            0: {
              opacity: 1
            },
            1: {
              opacity: 0
            }
          },
          duration: .35,
          fillMode: 'both',
          easing: 'easeOut',
          onComplete: function onComplete() {
            st.root.Destroy();
            st.holder.destroy();
          }
        });
      }
      function Active() {
        return state !== undefined;
      }
      function Update(dt) {
        var st = state;
        if (!st) return;
        var old = st.time;
        st.time += dt;
        if (st.phase !== 'profile') st.display = Math.min(st.target, st.display + dt * 1.5);
        while (st.nextLog <= 100 && st.display * 100 + .001 >= st.nextLog) {
          console.log('[Loading] ' + st.nextLog + '%');
          st.nextLog += 25;
        }
        if (Math.floor(old / 4) !== Math.floor(st.time / 4)) {
          st.tipIndex = (st.tipIndex + 1) % st.tips.length;
          setCopy(st.refs.tip, st.tips[st.tipIndex], 14, 'boot-body');
        }
        var cycle = st.time % 4;
        st.refs.tip.SetStyle({
          opacity: Math.min(1, cycle / .2, (4 - cycle) / .2)
        });
        var bounce = Math.sin(st.time * Math.PI * 4) * 2;
        st.refs.cart.SetStyle({
          translateY: bounce
        });
        st.refs.flag.SetStyle({
          translateY: -bounce
        });
        st.refs.sign.SetStyle({
          rotate: Math.sin(st.time * Math.PI) * 1.5
        });
        fit();
        refresh();
        if (st.done && st.display >= 1 && st.phase === 'downloading') {
          st.phase = 'ready';
          refresh();
          st.onReady();
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/localStorage.ts", ['cc'], function (exports) {
  var cclegacy, sys;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }],
    execute: function () {
      exports({
        keyValueGate: keyValueGate,
        localStorageGate: localStorageGate
      });
      cclegacy._RF.push({}, "824adHKDL5AeLzb9ru6tYtY", "localStorage", undefined);
      function localStorageGate(prefix) {
        if (prefix === void 0) {
          prefix = 'catshop-profile-';
        }
        return keyValueGate(sys.localStorage, prefix);
      }
      // Any store with the localStorage API (the CrazyGames data module has the same one).
      function keyValueGate(store, prefix) {
        if (prefix === void 0) {
          prefix = 'catshop-profile-';
        }
        return {
          read: function read(slot) {
            var raw;
            try {
              raw = store.getItem(prefix + slot);
            } catch (_unused) {
              return {
                error: '无法读取存档'
              };
            }
            // undefined: storage is blocked (incognito / cookies off) and Cocos put in a stub that returns nothing;
            // the game then plays without saving instead of reporting a broken save.
            if (raw === null || raw === undefined || raw === '') return {};
            try {
              return {
                data: JSON.parse(raw)
              };
            } catch (_unused2) {
              return {
                error: '存档 JSON 损坏'
              };
            }
          },
          write: function write(slot, data) {
            var encoded;
            try {
              encoded = JSON.stringify(data);
            } catch (_unused3) {
              return {
                ok: false,
                error: '存档编码失败'
              };
            }
            try {
              store.setItem(prefix + slot, encoded);
            } catch (_unused4) {
              return {
                ok: false,
                error: '无法写入存档'
              };
            }
            return {
              ok: true
            };
          }
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./authority.ts', './board.ts', './buildRules.ts', './config.ts', './i18n.ts', './presentation.ts', './profile.ts', './run.ts', './main.ts', './audio.ts', './dev.ts', './localStorage.ts', './runtime.ts', './types.ts', './adLoading.ts', './ads.ts', './app.ts', './assets.ts', './audio2.ts', './catView.ts', './design.ts', './feedback.ts', './game.ts', './gameState.ts', './itemOverlay.ts', './itemTags.ts', './kit.ts', './language.ts', './cats.ts', './handbook.ts', './home.ts', './loadError.ts', './loading.ts', './pause.ts', './play.ts', './result.ts', './resultDetails.ts', './settings.ts', './paper.ts', './rerollAd.ts', './resultAd.ts', './resultData.ts', './resumeCountdown.ts', './skillItemVfx.ts', './skin.ts', './text.ts', './tips.ts', './vfxState.ts', './widgets.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/main.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './assets.ts', './kit.ts', './app.ts', './home.ts', './cats.ts', './settings.ts', './handbook.ts', './run.ts', './loading.ts', './game.ts', './ads.ts', './audio2.ts', './runtime.ts', './audio.ts', './i18n.ts', './language.ts', './config.ts'], function () {
  var _inheritsLoose, _createForOfIteratorHelperLoose, cclegacy, _decorator, director, Director, Canvas, screen, profiler, game, input, Input, KeyCode, Game, Component, loadCatalog, catalogIds, overflows, applyResolution, createApp, Home, Cats, Settings, Select, Run, Active, Update, Prepare, Start, Finish, Prefetch, ProfileDone, newGame, Init$1, Init, Preload, pick, pickGameLanguage, nativeDebugFixture, pauseAudio, resumeAudio, misses, tableTexts, applyLanguage, cancelLanguageSwitch, DEMO, Upgrade;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      director = module.director;
      Director = module.Director;
      Canvas = module.Canvas;
      screen = module.screen;
      profiler = module.profiler;
      game = module.game;
      input = module.input;
      Input = module.Input;
      KeyCode = module.KeyCode;
      Game = module.Game;
      Component = module.Component;
    }, function (module) {
      loadCatalog = module.loadCatalog;
      catalogIds = module.catalogIds;
    }, function (module) {
      overflows = module.overflows;
    }, function (module) {
      applyResolution = module.applyResolution;
      createApp = module.createApp;
    }, function (module) {
      Home = module.Home;
    }, function (module) {
      Cats = module.Cats;
    }, function (module) {
      Settings = module.Settings;
    }, function (module) {
      Select = module.Select;
    }, function (module) {
      Run = module.Run;
    }, function (module) {
      Active = module.Active;
      Update = module.Update;
      Prepare = module.Prepare;
      Start = module.Start;
      Finish = module.Finish;
      Prefetch = module.Prefetch;
      ProfileDone = module.ProfileDone;
    }, function (module) {
      newGame = module.newGame;
    }, function (module) {
      Init$1 = module.Init;
    }, function (module) {
      Init = module.Init;
      Preload = module.Preload;
    }, function (module) {
      pick = module.pick;
      pickGameLanguage = module.pickGameLanguage;
      nativeDebugFixture = module.nativeDebugFixture;
    }, function (module) {
      pauseAudio = module.pauseAudio;
      resumeAudio = module.resumeAudio;
    }, function (module) {
      misses = module.misses;
      tableTexts = module.tableTexts;
    }, function (module) {
      applyLanguage = module.applyLanguage;
      cancelLanguageSwitch = module.cancelLanguageSwitch;
    }, function (module) {
      DEMO = module.DEMO;
      Upgrade = module.Upgrade;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "08dd9QsLwBOvoA8PFntNIGE", "main", undefined);
      var ccclass = _decorator.ccclass;

      // Drives App.Update every frame (Maker: SubscribeToEvent("Update")).
      var AppTicker = (_dec = ccclass('AppTicker'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(AppTicker, _Component);
        function AppTicker() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.app = null;
          return _this;
        }
        var _proto = AppTicker.prototype;
        _proto.update = function update(dt) {
          var _this$app;
          if (Active()) Update(dt);else (_this$app = this.app) == null || _this$app.Update(dt);
        };
        return AppTicker;
      }(Component)) || _class);
      director.on(Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        var _director$getScene;
        var canvas = (_director$getScene = director.getScene()) == null || (_director$getScene = _director$getScene.getComponentInChildren(Canvas)) == null ? void 0 : _director$getScene.node;
        if (!canvas) {
          console.error('[Boot] no Canvas in scene');
          return;
        }
        applyResolution();
        // Re-pick the policy when the window changes shape (immersive mode, rotation, resized browser).
        screen.on('window-resize', function () {
          return applyResolution();
        });
        profiler.hideStats();
        // The portal SDK initialises first (the CrazyGames data module preloads the save there).
        var runtime = pick();
        DEMO.on = globalThis.__DEMO === true;
        console.log('[Boot] platform', runtime.id, DEMO.on ? '(demo)' : '');
        // The portal is told loading starts once its SDK is up (before init the call has no effect).
        // Language before any copy is built: its table, and the font set that covers it (fontSetFor).
        // The language waits for the SDK: CrazyGames gives the player's locale only after init.
        // The player's language choice (settings picker) is kept beside the profile, in the same platform storage.
        var languageStore = function languageStore() {
          return runtime.storage('catshop-language-');
        };
        var language = runtime.init().then(function () {
          runtime.loadingStart();
          var saved;
          try {
            saved = languageStore().read(0).data;
          } catch (_unused) {
            saved = undefined;
          }
          var lang = pickGameLanguage(runtime.locale == null ? void 0 : runtime.locale(), saved);
          var auto = pickGameLanguage(runtime.locale == null ? void 0 : runtime.locale(), undefined);
          console.log('[Boot] language', lang, saved ? '(chosen)' : '');
          if (lang === auto) return applyLanguage(lang);
          // A saved choice whose table does not load falls back to the language the game would pick on its own.
          return applyLanguage(lang, true)["catch"](function (e) {
            console.warn('[Boot] language', lang, 'failed:', e == null ? void 0 : e.message, '- using', auto);
            return applyLanguage(auto);
          });
        });
        Promise.all([loadCatalog(), language]).then(function () {
          return Prepare();
        }).then(function () {
          // Loading B2 while the profile opens and the first art preloads; home mounts under it, then it fades.
          var ticker = canvas.addComponent(AppTicker);
          runtime.loadingShown == null || runtime.loadingShown();
          Start(canvas, function () {
            app.Home();
            Finish();
            runtime.loadingStop();
            Prefetch(app.profile.loadError ? ['tuantuan'] : app.profile.equipped);
            // Test hook: tools wait for this before driving the app.
            globalThis.__ready = true;
            nativeDebugFixture(function (name) {
              var _runtime$privacy;
              if (!name) return;
              console.log('[Boot] debug fixture', name);
              if (name === 'result-ad') {
                startRun(920, ['tuantuan', 'zhima'], {
                  tuantuan: 2,
                  zhima: 1
                });
                app.g.run.score = 38420;
                app.g.run.completedOrders = 3;
                app.EndRun();
              }
              if (name === 'choice-ad') {
                startRun(920, ['tuantuan', 'zhima'], {
                  tuantuan: 2,
                  zhima: 1
                });
                showChoice(['display_window', 'bake_candle', 'general_hourglass'], 0);
              }
              // The consent form again, as the settings entry will open it (no entry yet: needs a UI design first).
              if (name === 'privacy') (_runtime$privacy = runtime.privacy) == null || _runtime$privacy.required(function (required) {
                console.log('[Platform] privacy options', required ? 'required' : 'none');
                if (required) runtime.privacy.show(function (still) {
                  return console.log('[Platform] privacy options closed, still', still ? 'required' : 'none');
                });
              });
            });
          });
          var app = createApp(canvas, {
            Home: Home,
            Cats: Cats,
            Settings: Settings
          }, runtime.storage(), function (active) {
            return runtime.gameplay(active);
          });
          if (runtime.commercialBreak) app.commercialBreak = function () {
            return runtime.commercialBreak();
          };
          // Settings: the language picker saves the choice, then switches in place; the privacy row shows only while the
          // platform says the player's region needs it (AdMob UMP), and opens the platform's consent form.
          // The switch first (strict: nothing changes unless the table, port-only copy and fonts loaded), then the save, read back so a
          // storage stub that drops writes (blocked site data) is reported instead of quietly reverting at the next launch.
          // A stalled download (no engine request timeout on the web) gives up after 15 s: the picker must never hang.
          app.chooseLanguage = function (code) {
            var timer;
            var timeout = new Promise(function (ok, fail) {
              timer = setTimeout(function () {
                return fail(new Error('timeout'));
              }, 15000);
            });
            return Promise.race([applyLanguage(code, true), timeout]).then(function () {
              clearTimeout(timer);
              // The switch already happened: a storage that throws is a save failure, never a failed switch.
              try {
                var store = languageStore();
                var saved = store.write(0, code);
                return saved.ok && store.read(0).data === code ? 'ok' : 'unsaved';
              } catch (e) {
                console.warn('[Language] save failed', code, e == null ? void 0 : e.message);
                return 'unsaved';
              }
            }, function (e) {
              clearTimeout(timer);
              cancelLanguageSwitch();
              console.warn('[Language] switch failed', code, e == null ? void 0 : e.message);
              return 'failed';
            });
          };
          if (runtime.privacy) {
            var privacy = runtime.privacy;
            // Re-render only on a change, so a status reply never wipes a message on screen (and never loops).
            var refresh = function refresh(required) {
              var _props$text, _app$refs$message;
              if (app.privacyRequired === required) return;
              app.privacyRequired = required;
              if (app.screen !== 'settings') return;
              // A message still showing (a failed switch or save) is carried over to the rebuilt page.
              var shown = app.toastTime > 0 ? String((_props$text = (_app$refs$message = app.refs.message) == null ? void 0 : _app$refs$message.props.text) != null ? _props$text : '') : '';
              app.Settings();
              if (shown) {
                app.refs.message.SetText(shown);
                app.refs.message.SetStyle({
                  opacity: 1
                });
              }
            };
            privacy.watch == null || privacy.watch(refresh);
            privacy.required(refresh);
            app.checkPrivacy = function () {
              return privacy.required(refresh);
            };
            app.showPrivacy = function () {
              return privacy.show(refresh);
            };
          }
          // Host pause (YouTube Playables): stop the run and the engine loop until the host resumes.
          runtime.hostLifecycle == null || runtime.hostLifecycle(function () {
            if (app.screen === 'game') app.Pause();
            pauseAudio('host');
            game.pause();
          }, function () {
            game.resume();
            resumeAudio('host');
          });
          ticker.app = app;
          // F11: ESC / Android back go through App.Back; leaving the app (home key, tab hidden) pauses a run.
          input.on(Input.EventType.KEY_DOWN, function (e) {
            if (e.keyCode === KeyCode.MOBILE_BACK || e.keyCode === KeyCode.ESCAPE) app.Back();
          });
          // (Not on YouTube Playables: it forbids page-visibility handling; its onPause above does this.)
          if (runtime.id !== 'youtube') game.on(Game.EVENT_HIDE, function () {
            if (app.screen === 'game') app.Pause();
          });
          ProfileDone(app.profile.loadError ? ['tuantuan'] : app.profile.equipped, app.profile.loadError);
          // Test hook for screenshot runs (tools/ and the browser pane): window.__app.
          globalThis.__app = app;
          globalThis.__i18nMisses = misses;
          globalThis.__i18nTexts = tableTexts;
          globalThis.__overflows = overflows;
          globalThis.__selectHandbook = function (i) {
            return Select(app, i);
          };
          // Rewarded ads: no platform adapter yet; ?ads=fake gives the dev fake (always succeeds).
          // Sound: the voices, every catalog cue and track preloaded, the saved switches applied.
          Init(app.profile.settings);
          Preload(catalogIds('sfx.').concat(catalogIds('music.')));
          Init$1(runtime.ads);
          // Tour fixture (Maker tests/ui_tour_spec.lua): a run with a fixed seed shown directly, no countdown or tips.
          var startRun = function startRun(seed, equipped, levels, upgrades) {
            if (upgrades === void 0) {
              upgrades = [];
            }
            var run = new Run(seed, equipped, levels);
            for (var _iterator = _createForOfIteratorHelperLoose(upgrades), _step; !(_step = _iterator()).done;) {
              var _id = _step.value;
              run.ownedUpgrades[_id] = true;
            }
            run.upgradeOrder = upgrades.slice();
            var _app$profile$NewRunId = app.profile.NewRunId(),
              id = _app$profile$NewRunId[0];
            run.id = id != null ? id : 0;
            app.g = newGame(run, app.profile.best);
            app.Game();
            return run;
          };
          // Tour fixture: the choice overlay with three given candidates and one free reroll.
          var showChoice = function showChoice(ids, rerolls) {
            if (rerolls === void 0) {
              rerolls = 1;
            }
            var run = app.g.run;
            run.pendingUpgrades = 1;
            run.phase = 'upgrade';
            run.rerollRemaining = rerolls;
            run.choices = ids.map(function (id) {
              return Upgrade(id);
            });
            app.Upgrades();
          };
          globalThis.__startRun = startRun;
          globalThis.__showChoice = showChoice;
          console.log('[Boot] home mounted');
        }, function (e) {
          return console.error('[Boot] failed', e);
        });
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/paper.ts", ['cc', './kit.ts', './design.ts', './assets.ts', './audio.ts'], function (exports) {
  var cclegacy, UI, Label$1, colors, resolveAsset, playCue;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Label$1 = module.Label;
      colors = module.colors;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      playCue = module.playCue;
    }],
    execute: function () {
      exports({
        Button: Button,
        Label: Label,
        Paper: Paper
      });
      cclegacy._RF.push({}, "efc35105XBGp6zQGs28/+oF", "paper", undefined);
      function place(widget, x, y, w, h) {
        widget.SetStyle({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h
        });
        return widget;
      }
      function Label(value, size, x, y, w, h, bold, color, align) {
        var label = Label$1(value, size, color);
        label.SetStyle({
          fontFamily: bold ? 'sans' : 'body',
          textAlign: align != null ? align : 'center',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap'
        });
        return place(label, x, y, w, h);
      }

      // The slice values are source pixels and destination units at once: scale a source-sized background, keep content in
      // layout units.
      function Paper(id, w, h) {
        var asset = resolveAsset(id);
        var panel = UI.Panel({
          width: w,
          height: h,
          pointerEvents: 'none'
        });
        if (asset) {
          var _asset$width, _asset$width2, _asset$slice;
          var scale = w / ((_asset$width = asset.width) != null ? _asset$width : w);
          panel.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: (_asset$width2 = asset.width) != null ? _asset$width2 : w,
            height: h / scale,
            scale: scale,
            transformOrigin: 'top-left',
            pointerEvents: 'none',
            backgroundImage: asset.path,
            backgroundFit: 'sliced',
            backgroundSlice: (_asset$slice = asset.slice) != null ? _asset$slice : asset.slices
          }));
        } else panel.SetStyle({
          backgroundColor: colors.paper,
          borderColor: colors.line,
          borderWidth: 1,
          borderRadius: 12
        });
        return panel;
      }
      function Button(value, fn, w, h, secondary, disabled, size) {
        var button = UI.Button({
          width: w,
          height: h,
          disabled: disabled,
          opacity: disabled ? .65 : 1,
          onClick: function onClick() {
            playCue('sfx.click');
            fn();
          }
        });
        var id = 'ui.result.button.' + (secondary ? 'secondary' : 'primary');
        var asset = resolveAsset(id);
        if (asset) {
          var _asset$height, _asset$height2;
          // Complete curved ends at the height scale; only the flat middle stretches.
          var scale = h / ((_asset$height = asset.height) != null ? _asset$height : h);
          button.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: w / scale,
            height: (_asset$height2 = asset.height) != null ? _asset$height2 : h,
            scale: scale,
            transformOrigin: 'top-left',
            pointerEvents: 'none',
            backgroundImage: asset.path,
            backgroundFit: 'sliced',
            backgroundSlice: [0, 128, 0, 128]
          }));
        } else button.AddChild(place(Paper(id, w, h), 0, 0, w, h));
        // 0.6 up: the plank's lower rim is thicker than the upper one, so the glyphs centre on its face.
        button.AddChild(Label(value, size != null ? size : 20, 8, -.6, w - 16, h, true));
        return button;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/pause.ts", ['cc', './kit.ts', './skin.ts', './i18n.ts', './play.ts', './resumeCountdown.ts', './handbook.ts', './text.ts'], function (exports) {
  var cclegacy, UI, Image, Face, Text, ink, muted, warmRed, Row, ImageButton, FaceText, L, Remaining, Start, Open, formatNumber;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Face = module.Face;
      Text = module.Text;
      ink = module.ink;
      muted = module.muted;
      warmRed = module.warmRed;
      Row = module.Row;
      ImageButton = module.ImageButton;
      FaceText = module.FaceText;
    }, function (module) {
      L = module.L;
    }, function (module) {
      Remaining = module.Remaining;
    }, function (module) {
      Start = module.Start;
    }, function (module) {
      Open = module.Open;
    }, function (module) {
      formatNumber = module.formatNumber;
    }],
    execute: function () {
      exports('Pause', Pause);
      cclegacy._RF.push({}, "b15e9/MNP9AeLBi0Xlm1Plt", "pause", undefined);
      function Pause(app) {
        var g = app.g;
        if (app.screen !== 'game') app.Game();
        app.screen = 'pause';
        g.drag = undefined;
        g.queued = undefined;
        // The root swallows touches so the board underneath stays inert.
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          onClick: function onClick() {}
        });
        root.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundColor: [47, 32, 20, 150]
        }));
        // The shell starts just below the cats' faces (the order card may be covered).
        root.AddChild(Image('ui.item_overlay.shell.plain', 32, 158, 296, 390, [255, 247, 224, 255]));
        root.AddChild(Image('ui.pause.title_plaque', 80, 172, 200, 60));
        {
          var _S$Face = Face('ui.pause.title_plaque', 80, 172, 200, 60),
            tfx = _S$Face[0],
            tfy = _S$Face[1],
            tfw = _S$Face[2],
            tfh = _S$Face[3];
          root.AddChild(Text(L('休息一下'), 18, tfx, tfy + tfh / 2 - 20, tfw, 40, ink));
        }
        root.AddChild(Image('ui.pause.score_panel', 52, 236, 256, 64));
        {
          var _S$Face2 = Face('ui.pause.score_panel', 52, 236, 256, 64, 10),
            fx = _S$Face2[0],
            fy = _S$Face2[1],
            fw = _S$Face2[2],
            fh = _S$Face2[3];
          root.AddChild(Text(L('本局得分'), 12, fx, fy + 5, fw, fh * .34 - 3, muted, 'center', 'body'));
          root.AddChild(Text(formatNumber(g.run.score), 28, fx, fy + fh * .34, fw, fh * .66 - 2, ink));
        }
        var remaining = Remaining(app);
        var chips = [{
          x: 52,
          icon: 'ui.icon.orders.r02',
          text: L('已完成 {0} 单', g.run.completedOrders),
          color: ink
        }, {
          x: 184,
          icon: 'ui.icon.hourglass.r02',
          text: L('剩余 {0} 秒', Math.ceil(remaining)),
          color: remaining <= 10 ? warmRed : ink
        }];
        for (var _i = 0, _chips = chips; _i < _chips.length; _i++) {
          var c = _chips[_i];
          root.AddChild(Image('ui.pause.info_chip', c.x, 310, 124, 42));
          var _S$Face3 = Face('ui.pause.info_chip', c.x, 310, 124, 42, 8),
            _fx = _S$Face3[0],
            _fy = _S$Face3[1],
            _fw = _S$Face3[2],
            _fh = _S$Face3[3];
          root.AddChild(Row(_fx, _fy, _fw, _fh, [{
            icon: c.icon,
            size: 16
          }, {
            text: c.text,
            size: 13,
            color: c.color,
            family: 'body'
          }], 4));
        }
        var _S$ImageButton = ImageButton('ui.item_overlay.button.primary', 68, 374, 224, 52, function () {
            return Start(app);
          }, {
            pressScale: .96
          }),
          resumeRoot = _S$ImageButton[0],
          resumeBtn = _S$ImageButton[1],
          resumeFace = _S$ImageButton[2];
        {
          var _S$Face4 = Face('ui.item_overlay.button.primary', 0, 0, 224, 52, 10),
            _fx2 = _S$Face4[0],
            _fy2 = _S$Face4[1],
            _fw2 = _S$Face4[2],
            _fh2 = _S$Face4[3];
          resumeFace.AddChild(Row(_fx2, _fy2, _fw2, _fh2, [{
            icon: 'ui.icon.play.r02',
            size: 20
          }, {
            text: L('继续营业'),
            size: 18
          }], 6));
        }
        root.AddChild(resumeRoot);
        var _S$ImageButton2 = ImageButton('ui.item_overlay.button.secondary', 88, 438, 184, 40, function () {
            return app.EndRun();
          }, {
            pressScale: .96,
            hitPad: 2
          }),
          endRoot = _S$ImageButton2[0],
          endBtn = _S$ImageButton2[1],
          endFace = _S$ImageButton2[2];
        endFace.AddChild(FaceText('ui.item_overlay.button.secondary', 0, 0, 184, 40, L('结束并结算'), 15, ink, 'center', 'sans', 8));
        root.AddChild(endRoot);
        var _S$ImageButton3 = ImageButton('ui.item_overlay.button.secondary', 88, 490, 184, 40, function () {
            return Open(app);
          }, {
            pressScale: .96,
            hitPad: 2
          }),
          rulesRoot = _S$ImageButton3[0],
          rulesBtn = _S$ImageButton3[1],
          rulesFace = _S$ImageButton3[2];
        rulesFace.AddChild(FaceText('ui.item_overlay.button.secondary', 0, 0, 184, 40, L('玩法说明'), 15, ink, 'center', 'sans', 8));
        root.AddChild(rulesRoot);
        app.refs.pauseHandbook = rulesBtn;
        root.AddChild(Text(L('继续前有 3 秒准备时间'), 11, 32, 353, 296, 18, [104, 72, 44, 255], 'center', 'body'));
        app.page.AddChild(root);
        root.Animate({
          keyframes: {
            0: {
              opacity: 0
            },
            1: {
              opacity: 1
            }
          },
          duration: .18,
          fillMode: 'both',
          easing: 'easeOut'
        });
        app.refs.pauseRoot = root;
        app.refs.pauseResume = resumeBtn;
        app.refs.pauseEnd = endBtn;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/play.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './widgets.ts', './skin.ts', './design.ts', './catView.ts', './config.ts', './vfxState.ts', './i18n.ts', './assets.ts', './text.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, Node, UITransform, Vec3, UI, ProgressBar, Sketch, Face, ShopBackground, AnchorGroup, CatPlaceholder, Art, colors, UpgradeArt, Create, SESSION_LIMIT, Cat, SIZE, RECOVERY_FADE_END, RECOVERY_FADE_START, goods, CatLevel, SkillIcon, Upgrade, NewCharge, SetCharge, UpdateCharge, Fire, L, resolveAsset, formatNumber, fitSize, fitText, textWidth;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      UITransform = module.UITransform;
      Vec3 = module.Vec3;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      ProgressBar = module.ProgressBar;
      Sketch = module.Sketch;
    }, function (module) {
      Face = module.Face;
    }, function (module) {
      ShopBackground = module.ShopBackground;
      AnchorGroup = module.AnchorGroup;
      CatPlaceholder = module.CatPlaceholder;
      Art = module.Art;
      colors = module.colors;
      UpgradeArt = module.UpgradeArt;
    }, function (module) {
      Create = module.Create;
    }, function (module) {
      SESSION_LIMIT = module.SESSION_LIMIT;
      Cat = module.Cat;
      SIZE = module.SIZE;
      RECOVERY_FADE_END = module.RECOVERY_FADE_END;
      RECOVERY_FADE_START = module.RECOVERY_FADE_START;
      goods = module.goods;
      CatLevel = module.CatLevel;
      SkillIcon = module.SkillIcon;
      Upgrade = module.Upgrade;
    }, function (module) {
      NewCharge = module.NewCharge;
      SetCharge = module.SetCharge;
      UpdateCharge = module.UpdateCharge;
      Fire = module.Fire;
    }, function (module) {
      L = module.L;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      formatNumber = module.formatNumber;
      fitSize = module.fitSize;
      fitText = module.fitText;
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports({
        Build: Build,
        Layout: Layout,
        Refresh: Refresh,
        Remaining: Remaining
      });
      cclegacy._RF.push({}, "3d9feyHCcdEjIcQHN1eX1df", "play", undefined);
      var K = colors;
      var ink = K.ink,
        green = K.mint,
        red = K.red;
      function place(widget, x, y, w, h) {
        widget.SetStyle({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h
        });
        return widget;
      }
      // Labels in final sizes (not routed through D.Label, which multiplies every size by 0.75).
      function text(value, size, x, y, w, h, color, align, family) {
        return UI.Label({
          minFontSize: 9,
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          text: value,
          fontSize: size,
          fontColor: color != null ? color : ink,
          textAlign: align != null ? align : 'center',
          verticalAlign: 'middle',
          whiteSpace: 'normal',
          fontFamily: family != null ? family : 'body',
          pointerEvents: 'none'
        });
      }
      function imagePanel(id, x, y, w, h, fit) {
        var asset = resolveAsset(id);
        return UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundImage: asset ? asset.path : null,
          backgroundFit: fit != null ? fit : 'fill',
          pointerEvents: 'none'
        });
      }
      function framedAsset(id, x, y, w, h, fallback, borderRadius) {
        var asset = resolveAsset(id);
        return UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          pointerEvents: 'none',
          backgroundImage: asset ? asset.path : null,
          backgroundFit: 'fill',
          backgroundColor: asset ? [0, 0, 0, 0] : fallback,
          borderRadius: borderRadius != null ? borderRadius : 0,
          borderWidth: asset ? 0 : 1.5,
          borderColor: [116, 72, 38, 255]
        });
      }
      function pawIcon(size, color) {
        var icon = UI.Panel({
          width: size,
          height: size,
          pointerEvents: 'none'
        });
        var s = size / 21;
        for (var _i = 0, _arr = [[2, 1, 5, 5], [8, 0, 5, 5], [14, 1, 5, 5], [18, 5, 4, 4]]; _i < _arr.length; _i++) {
          var dot = _arr[_i];
          icon.AddChild(UI.Panel({
            position: 'absolute',
            left: dot[0] * s,
            top: dot[1] * s,
            width: dot[2] * s,
            height: dot[3] * s,
            backgroundColor: color,
            borderRadius: 3 * s,
            pointerEvents: 'none'
          }));
        }
        icon.AddChild(UI.Panel({
          position: 'absolute',
          left: 6 * s,
          top: 7 * s,
          width: 12 * s,
          height: 9 * s,
          backgroundColor: color,
          borderRadius: 6 * s,
          pointerEvents: 'none'
        }));
        return icon;
      }
      // Children laid out in a centred row (the Maker panels use flexDirection row + justifyContent/alignItems center).
      function centreRow(panel, items, gap) {
        var _panel$GetLayout = panel.GetLayout(),
          w = _panel$GetLayout.w,
          h = _panel$GetLayout.h;
        var sizes = items.map(function (it) {
          return it.GetLayout();
        });
        var x = (w - (sizes.reduce(function (a, b) {
          return a + b.w;
        }, 0) + gap * (items.length - 1))) / 2;
        items.forEach(function (it, i) {
          it.SetStyle({
            position: 'absolute',
            left: x,
            top: (h - sizes[i].h) / 2
          });
          panel.AddChild(it);
          x += sizes[i].w + gap;
        });
      }

      // Cat badge (play-a component L22: plate ui.play.cat_charge_plate + program-drawn charge arc), drawn at 1.4x the 54x42
      // plan. Geometry measured on the 162x126 art: ring centre (80.5,50.5), ring 32.5..47.5, name band rows 92-113.
      var BADGE_K = 1.4;
      var BADGE_W = 162 * BADGE_K / 3,
        BADGE_H = 126 * BADGE_K / 3;
      // The name band is 5 taller than the art: the plate is drawn in three clipped layers (top, a vertical stretch of the
      // band's plain rows 100-104, bottom), so only the band grows and the medallion keeps its shape.
      var NAME_EXTRA = 5;
      var BAND_CUT = 100,
        BAND_ROWS = 4;
      function catPlate(x, y) {
        var asset = resolveAsset('ui.play.cat_charge_plate');
        var h = BADGE_H + NAME_EXTRA;
        if (!asset) return framedAsset('ui.play.cat_charge_plate', x, y, BADGE_W, h, [255, 239, 203, 245], 12);
        var s = BADGE_K / 3,
          cut = BAND_CUT * s;
        var root = UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: BADGE_W,
          height: h,
          pointerEvents: 'none'
        });
        var layer = function layer(top, height, imageTop, imageH) {
          var clip = UI.Panel({
            position: 'absolute',
            left: 0,
            top: top,
            width: BADGE_W,
            height: height,
            overflow: 'hidden',
            pointerEvents: 'none'
          });
          clip.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: imageTop,
            width: BADGE_W,
            height: imageH,
            backgroundImage: asset.path,
            backgroundFit: 'fill',
            pointerEvents: 'none'
          }));
          root.AddChild(clip);
        };
        // Each layer runs 0.5 under the next one (plain paper there), so no seam shows between them.
        layer(0, cut + .5, 0, BADGE_H);
        var f = NAME_EXTRA / (BAND_ROWS * s);
        layer(cut, NAME_EXTRA + .5, -cut * f, BADGE_H * f);
        layer(cut + NAME_EXTRA, BADGE_H - cut, -cut, BADGE_H);
        return root;
      }
      var RING_X = 80.5 * BADGE_K / 3,
        RING_Y = 50.5 * BADGE_K / 3;
      var RING_MID = 40 * BADGE_K / 3,
        RING_W = 15 * BADGE_K / 3;
      function catSkillIcon(catId) {
        // Centred on the measured ring centre; art icons for every skill except 团团's collect, which keeps the drawn paw.
        var id = catId ? SkillIcon(catId) : undefined;
        if (id && id !== 'icon.cat.skill.collect') {
          var w = id === 'ui.r02.special.bomb' ? 18 : 21;
          var h = id === 'ui.r02.special.bomb' ? 18 * 128 / 118 : 21;
          var art = Art(id, w, h, '●');
          art.SetStyle({
            position: 'absolute',
            left: RING_X - w / 2,
            top: RING_Y - h / 2,
            width: w,
            height: h
          });
          return art;
        }
        // pawIcon's shape spans x2..22, y0..16 of its 21-unit box: centre that shape, not the box.
        var size = 19,
          k = size / 21;
        var icon = pawIcon(size, green);
        icon.SetStyle({
          position: 'absolute',
          left: RING_X - 12 * k,
          top: RING_Y - 8 * k,
          width: size,
          height: size
        });
        return icon;
      }

      // Charge arc on the medallion's wood ring, clockwise from the top (component L22). The paper name band occludes the
      // ring from plate row 80, like the accepted full-ring PNG: the arc is drawn inside a clip that ends there.
      function chargeArc() {
        var d = RING_MID * 2;
        var clipTop = -8,
          clipH = 80 * BADGE_K / 3 - (RING_Y - RING_MID) + 8;
        var root = UI.Panel({
          position: 'absolute',
          left: RING_X - RING_MID,
          top: RING_Y - RING_MID,
          width: d,
          height: d,
          pointerEvents: 'none',
          overflow: 'visible'
        });
        var clip = UI.Panel({
          position: 'absolute',
          left: -8,
          top: clipTop,
          width: d + 16,
          height: clipH,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        var sketch = new Sketch({
          position: 'absolute',
          left: 8,
          top: -clipTop,
          width: d,
          height: d,
          pointerEvents: 'none'
        });
        clip.AddChild(sketch);
        root.AddChild(clip);
        var glow = resolveAsset('fx.glow');
        var arc = {
          root: root,
          sketch: sketch,
          state: NewCharge(0),
          value: 0,
          SetValue: function SetValue(v, direct) {
            if (v > arc.state.target && !direct) console.log("[VFX] charge growth " + arc.state.target + " -> " + v);
            SetCharge(arc.state, v, direct);
            arc.value = arc.state.value;
            arc.Draw();
          },
          Step: function Step(dt) {
            var full = arc.state.full;
            arc.value = UpdateCharge(arc.state, dt);
            if (arc.state.full && !full) console.log('[VFX] charge full');
            arc.Draw();
          },
          Fire: function Fire$1() {
            Fire(arc.state);
            arc.value = 0;
            console.log('[VFX] charge fire');
            arc.Draw();
          },
          Draw: function Draw() {
            sketch.Begin();
            var v = arc.value;
            if (v > 0 && !arc.state.full) {
              var r = RING_MID,
                start = -Math.PI / 2;
              sketch.Arc(r, r, r, start, start + 2 * Math.PI * Math.min(v, .999), RING_W * .62 * 1.6, [green[0], green[1], green[2], 235]);
              if (arc.state.age < .22 && glow) {
                var a = start + 2 * Math.PI * v;
                sketch.Image(glow.path, r + Math.cos(a) * r, r + Math.sin(a) * r, 14, 14, 1 - arc.state.age / .22);
              }
            }
            sketch.End();
          }
        };
        return arc;
      }

      // One remaining-time definition for HUD, low-time colour and pause card: the smaller of banked time (minus
      // not-yet-shown bonus) and the business-hours cap.
      function Remaining(app) {
        var g = app.g;
        var run = g.run;
        var pending = g.presentation ? g.presentation.PendingTime() : 0;
        return Math.max(0, Math.min(run.time - pending, SESSION_LIMIT - run.elapsed));
      }
      function Layout() {
        return {
          board: 298,
          x: 31,
          y: 237,
          orderY: 160,
          orderH: 66,
          catY: 80,
          catHeight: 98,
          catWidth: 112
        };
      }
      function Build(app, handlers) {
        var g = app.g;
        var w = 360,
          h = 640;
        var l = Layout();
        var page = UI.Panel({
          width: w,
          height: h,
          backgroundColor: [246, 232, 209, 255],
          overflow: 'hidden'
        });
        app.refs = {};
        var refs = {};
        g.play = refs;
        refs.backgroundTop = ShopBackground(page, w, h);

        // Top signs: separate risk (time) and reward (score) so both remain readable.
        refs.timerPlate = framedAsset('ui.play.timer_plate', 64, 6, 104, 54, [255, 238, 196, 245], 10);
        refs.timerPlate.SetStyle({
          overflow: 'hidden'
        });
        // Digits sit on the plate's measured face (y23.7-47.4, below the chain).
        refs.time = text('', 17, 16, 23.7, 72, 23.7, ink, 'center', 'sans');
        // A 16-tall chip (fill + 1 px border) with the text as its own borderless child.
        refs.timeGainChip = UI.Panel({
          position: 'absolute',
          left: 78,
          top: 66,
          width: 76,
          height: 16,
          borderRadius: 5,
          pointerEvents: 'none'
        });
        refs.timeGain = text('', 9, 0, 0, 76, 16, green, 'center', 'sans');
        refs.timeGainChip.AddChild(refs.timeGain);
        refs.timerPlate.AddChild(refs.time);
        // The top signs, the pause button and the toast follow the screen top on tall screens; the item shelf the bottom.
        var topRow = AnchorGroup(page, 'top');
        topRow.AddChild(refs.timerPlate);
        topRow.AddChild(refs.timeGainChip);

        // 114 wide so a 7-character score ("999,999") fits at the 9 pt minimum.
        refs.scorePlate = framedAsset('ui.play.score_plate', 192, 18, 114, 42, [239, 217, 173, 248], 9);
        refs.scorePlate.SetStyle({
          overflow: 'hidden'
        });
        refs.scoreCaption = text(L('得分'), 9, 20.5, 11.3, 26, 20.3, ink, 'left', 'sans');
        refs.scoreCaption.SetStyle({
          whiteSpace: 'nowrap'
        });
        refs.score = text('', 16, 45, 11.3, 50, 20.3, ink, 'right', 'sans');
        refs.score.SetStyle({
          whiteSpace: 'nowrap'
        });
        refs.scorePlate.AddChild(refs.scoreCaption);
        refs.scorePlate.AddChild(refs.score);
        topRow.AddChild(refs.scorePlate);
        refs.pause = UI.Button({
          position: 'absolute',
          left: 312,
          top: 16,
          width: 44,
          height: 44,
          backgroundColor: [250, 220, 161, 255],
          borderColor: ink,
          borderWidth: 2,
          borderRadius: 22,
          onClick: function onClick() {
            return app.Pause();
          }
        });
        for (var _i2 = 0, _arr2 = [14, 25]; _i2 < _arr2.length; _i2++) {
          var x = _arr2[_i2];
          refs.pause.AddChild(UI.Panel({
            position: 'absolute',
            left: x,
            top: 13,
            width: 5,
            height: 18,
            borderRadius: 2,
            backgroundColor: ink,
            pointerEvents: 'none'
          }));
        }
        topRow.AddChild(refs.pause);

        // Two fixed cat stages, reserved even when only one partner is equipped. The cat layer is drawn over the receipt
        // (reaching paws) and ends 16 below the paw root; the feet stand 2 into the receipt rim.
        var catRootY = l.orderY + 8;
        var catLayer = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: catRootY + 16,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        refs.catLayer = catLayer;
        refs.catRootY = catRootY;
        page.AddChild(catLayer);
        refs.catSlots = [];
        refs.catPlaceholders = {};
        refs.catStates = [];
        var slotX = [66, 182];
        for (var i = 0; i < 2; i++) {
          var cat = g.run.cats[i];
          var _x = slotX[i];
          refs.catSlots[i] = {
            x: _x,
            y: l.catY,
            w: l.catWidth,
            h: l.catHeight
          };
          if (cat) {
            // Cats at 0.72 so the top HUD matches the approved Play A proportions.
            var actor = Create(cat.id, cat.level, {
              x: _x + l.catWidth / 2,
              y: catRootY,
              slot: i + 1,
              context: 'play',
              dual: g.run.cats.length === 2,
              scale: .72
            });
            if (actor) {
              if (cat.id === 'zhima') catLayer.InsertChild(actor, 0);else catLayer.AddChild(actor);
            } else {
              var portrait = place(CatPlaceholder(cat.id, l.catWidth, l.catHeight), _x, l.catY + 5, l.catWidth, l.catHeight);
              catLayer.AddChild(portrait);
              refs.catPlaceholders[cat.id] = portrait;
            }
          }
          // Same centres as the 54x42 plan (x67 / x293), bottom on the counter line y154.
          var badgeX = (i === 0 ? 67 : 293) - BADGE_W / 2;
          var badge = catPlate(badgeX, 154 - BADGE_H - NAME_EXTRA);
          badge.SetStyle({
            opacity: cat ? 1 : .52
          });
          var skill = catSkillIcon(cat == null ? void 0 : cat.id);
          var charge = chargeArc();
          var fullRing = imagePanel('ui.play.cat_charge_full_ring', 0, 0, BADGE_W, BADGE_H);
          fullRing.SetStyle({
            opacity: 0
          });
          var sparkles = [[-22, -8], [23, -8], [18, 18]].map(function (o) {
            var star = imagePanel('ui.resume.sparkle', RING_X + o[0] - 6, RING_Y + o[1] - 6, 12, 12);
            star.SetStyle({
              opacity: 0
            });
            return star;
          });
          // Name centred on the paper rows 90-111 of the art grown by NAME_EXTRA, in a 14-tall box.
          var bandX = 14 * BADGE_K / 3;
          var nameY = (90 + 111) / 2 * BADGE_K / 3 + NAME_EXTRA / 2 - 7;
          var name = text(cat ? L(Cat(cat.id).name) : L('空位'), 9, bandX + 2, nameY, 133 * BADGE_K / 3 - 4, 14, ink, 'center', 'body');
          badge.AddChild(skill);
          badge.AddChild(charge.root);
          badge.AddChild(fullRing);
          for (var _iterator = _createForOfIteratorHelperLoose(sparkles), _step; !(_step = _iterator()).done;) {
            var star = _step.value;
            badge.AddChild(star);
          }
          badge.AddChild(name);
          page.AddChild(badge);
          refs.catStates[i] = {
            name: name,
            skill: skill,
            charge: charge,
            badge: badge,
            cat: cat,
            fullRing: fullRing,
            sparkles: sparkles
          };
        }

        // One horizontal receipt keeps current order, progress and next-order preview together.
        refs.orderCard = framedAsset('ui.play.order_receipt', 16, l.orderY, 328, l.orderH, [255, 244, 213, 250], 8);
        refs.orderCard.SetStyle({
          overflow: 'hidden'
        });
        // Receipt face x27.6-300.4, y20.7-56.7 (measured); column 1 keeps 6 from the face edge and the divider.
        refs.order = text('', 15, 34, 20.7, 38, 36, ink, 'center', 'sans');
        refs.order.SetStyle({
          whiteSpace: 'nowrap'
        });
        refs.preferences = UI.Panel({
          position: 'absolute',
          left: 80,
          top: 20,
          width: 102,
          height: 34,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        refs.orderValue = text('', 13, 193, 26, 54, 16, ink, 'center', 'sans');
        refs.orderValue.SetStyle({
          whiteSpace: 'nowrap'
        });
        refs.orderValueTop = text('', 10.5, 191, 26, 58, 12, ink, 'center', 'sans');
        // Second line = a small "共" + the total in the size of the line above; placed per refresh.
        refs.orderTotalWord = text('', 9, 191, 36.5, 20, 14, K.muted, 'left', 'body');
        refs.orderValueBottom = text('', 10.5, 191, 36, 58, 14, K.muted, 'left', 'sans');
        refs.progress = new ProgressBar({
          position: 'absolute',
          left: 190,
          top: 39,
          width: 59,
          height: 8,
          value: 0,
          fillColor: green,
          borderColor: [143, 92, 48, 255],
          borderWidth: 1,
          borderRadius: 5,
          pointerEvents: 'none'
        });
        refs.nextOrderTitle = text(L('下一单'), 9, 256, 27, 40, 12, ink, 'center', 'body');
        refs.nextOrder = UI.Panel({
          position: 'absolute',
          left: 253,
          top: 39,
          width: 44,
          height: 17,
          overflow: 'hidden',
          pointerEvents: 'none'
        });
        for (var _i3 = 0, _arr3 = [refs.order, refs.preferences, refs.orderValue, refs.orderValueTop, refs.orderTotalWord, refs.orderValueBottom, refs.progress, refs.nextOrderTitle, refs.nextOrder]; _i3 < _arr3.length; _i3++) {
          var c = _arr3[_i3];
          refs.orderCard.AddChild(c);
        }
        // Under the cat layer so reaching paws draw over the receipt; the wooden counter behind it (top outline y166 = the
        // receipt rim, lower edge tucked under the board frame).
        var catIndex = page.children.indexOf(catLayer);
        page.InsertChild(refs.orderCard, catIndex);
        refs.counter = imagePanel('ui.play.counter', 0, 165, w, 70);
        page.InsertChild(refs.counter, catIndex);

        // Board frame: the accepted R02 eight-piece frame.
        refs.boardFrame = [];
        var e = 7,
          bx = l.x - e,
          by = l.y - e;
        for (var _i4 = 0, _arr4 = [['tl', bx, by, e, e], ['top', l.x, by, l.board, e], ['tr', l.x + l.board, by, e, e], ['left', bx, l.y, e, l.board], ['right', l.x + l.board, l.y, e, l.board], ['bl', bx, l.y + l.board, e, e], ['bottom', l.x, l.y + l.board, l.board, e], ['br', l.x + l.board, l.y + l.board, e, e]]; _i4 < _arr4.length; _i4++) {
          var v = _arr4[_i4];
          var piece = imagePanel('ui.r02.board_frame.' + v[0], v[1], v[2], v[3], v[4]);
          page.AddChild(piece);
          refs.boardFrame.push(piece);
        }
        var board = UI.Panel({
          position: 'absolute',
          left: l.x,
          top: l.y,
          width: l.board,
          height: l.board,
          overflow: 'hidden',
          backgroundColor: [255, 238, 204, 255]
        });
        refs.board = board;
        bindPointer(board, handlers);
        g.cellSize = l.board / SIZE;
        g.tiles = [];
        for (var r = 1; r <= SIZE; r++) {
          g.tiles[r] = [];
          for (var _c = 1; _c <= SIZE; _c++) {
            var size = g.cellSize;
            board.AddChild(UI.Panel({
              position: 'absolute',
              left: (_c - 1) * size + 1,
              top: (r - 1) * size + 1,
              width: size - 2,
              height: size - 2,
              backgroundColor: [255, 231, 181, 255],
              borderRadius: 4,
              pointerEvents: 'none'
            }));
            var item = UI.Panel({
              position: 'absolute',
              left: (_c - 1) * size + 2,
              top: (r - 1) * size + 2,
              width: size - 4,
              height: size - 4,
              borderRadius: 5,
              pointerEvents: 'none'
            });
            // The art sits in its own full-size layer so the cell flip can scale it horizontally about the centre.
            var art = UI.Panel({
              position: 'absolute',
              left: 0,
              top: 0,
              width: size - 4,
              height: size - 4,
              pointerEvents: 'none'
            });
            var image = UI.Panel({
              position: 'absolute',
              left: 1,
              top: 1,
              width: size - 6,
              height: size - 6,
              backgroundFit: 'contain',
              pointerEvents: 'none'
            });
            var overlay = UI.Panel({
              position: 'absolute',
              left: 0,
              top: 0,
              width: size - 4,
              height: size - 4,
              backgroundFit: 'contain',
              pointerEvents: 'none'
            });
            var bs = size * .34;
            var _badge = UI.Panel({
              position: 'absolute',
              left: size - 4 - 1 - bs,
              top: size - 4 - 1 - bs,
              width: bs,
              height: bs,
              backgroundFit: 'contain',
              backgroundColor: [255, 246, 222, 245],
              borderRadius: size * .18,
              pointerEvents: 'none',
              opacity: 0
            });
            var caption = text('', size * .25, 0, 0, size - 4, size - 4, ink, 'center');
            var mark = text('', size * .23, size * .55, size * .55, size * .4, size * .4, ink, 'center');
            art.AddChild(image);
            art.AddChild(caption);
            art.AddChild(overlay);
            art.AddChild(mark);
            art.AddChild(_badge);
            item.AddChild(art);
            g.tiles[r][_c] = {
              panel: item,
              art: art,
              image: image,
              overlay: overlay,
              text: caption,
              mark: mark,
              badge: _badge
            };
            board.AddChild(item);
          }
        }
        page.AddChild(board);
        refs.chainStrip = framedAsset('ui.play.chain_strip', 20, 544, 320, 34, [255, 241, 211, 245], 7);
        // Chain strip face x28.8-289.6, y6.7-26.4 (measured).
        refs.feedback = text(g.lastChainFeedback, 12, 35, 6.7, 248, 19.7, ink, 'center', 'sans');
        refs.feedback.SetStyle({
          whiteSpace: 'nowrap'
        });
        refs.buildState = text('', 10, 8, 4, 304, 26, K.muted, 'center', 'body');
        refs.feedbackCombo = text('', 22, 4, 1, 132, 32, [205, 96, 38, 255], 'right', 'sans');
        refs.feedbackCombo.SetStyle({
          whiteSpace: 'nowrap',
          opacity: 0
        });
        refs.feedbackPill = text('', 11, 146, 7, 140, 20, [255, 244, 222, 255], 'center', 'sans');
        refs.feedbackPill.SetStyle({
          whiteSpace: 'nowrap',
          opacity: 0,
          backgroundColor: [118, 74, 42, 245],
          borderRadius: 10
        });
        for (var _i5 = 0, _arr5 = [refs.feedback, refs.feedbackCombo, refs.feedbackPill, refs.buildState]; _i5 < _arr5.length; _i5++) {
          var _c2 = _arr5[_i5];
          refs.chainStrip.AddChild(_c2);
        }
        page.AddChild(refs.chainStrip);

        // Item shelf A (item-shelf-r01, user-approved): one plank, items on small paper mats with a contact shadow.
        refs.itemTray = UI.Panel({
          position: 'absolute',
          left: 6,
          top: 578,
          width: 348,
          height: 62,
          overflow: 'visible'
        });
        refs.itemTray.AddChild(framedAsset('ui.play.item_shelf', 0, 32, 348, 28, [214, 160, 92, 255], 6));
        AnchorGroup(page, 'bottom').AddChild(refs.itemTray);
        refs.itemButtons = [];
        refs.itemIcons = [];
        var centers = [36, 102, 168, 234, 300];
        var _loop = function _loop() {
          var id = g.run.upgradeOrder[_i6];
          var slotDef = id ? Upgrade(id) : undefined;
          var cx = centers[_i6] - 6;
          var mat = framedAsset('ui.play.item_mat', cx - 21, 41, 42, 11, [255, 244, 218, 255], 4);
          mat.SetStyle({
            opacity: slotDef ? 1 : .45
          });
          refs.itemTray.AddChild(mat);
          var icon;
          if (slotDef) {
            refs.itemTray.AddChild(UI.Panel({
              position: 'absolute',
              left: cx - 17,
              top: 43,
              width: 34,
              height: 5,
              borderRadius: 3,
              backgroundColor: [92, 58, 30, 50],
              pointerEvents: 'none'
            }));
            // Stand each icon on its visible base: catalog bottomPad = transparent rows below the art (fraction).
            var _art = resolveAsset('upgrade.' + slotDef.id);
            var pad = _art && _art.bottomPad !== undefined ? Number(_art.bottomPad) : .06;
            icon = place(UpgradeArt(slotDef, 40, goods), 10, Math.min(14, 5 + pad * 40), 40, 40);
            refs.itemIcons[_i6] = icon;
          }
          var button = UI.Button({
            position: 'absolute',
            left: cx - 30,
            top: 2,
            width: 60,
            height: 56,
            onClick: function onClick() {
              if (!slotDef) {
                app.Toast('完成订单后可选择谢礼');
                return;
              }
              app.ShowItemDetail == null || app.ShowItemDetail(slotDef.id);
            }
          });
          if (icon) {
            button.AddChild(icon);
            var ic = icon;
            button.onPointerDown = function () {
              return ic.SetStyle({
                scale: .94
              });
            };
            button.onPointerUp = function () {
              return ic.SetStyle({
                scale: 1
              });
            };
            button.onPointerCancel = function () {
              return ic.SetStyle({
                scale: 1
              });
            };
          }
          refs.itemTray.AddChild(button);
          refs.itemButtons[_i6] = button;
        };
        for (var _i6 = 0; _i6 < 5; _i6++) {
          _loop();
        }

        // The toast sits in the gap between the top plates (end y60) and the cats' ears (~y88), never over the cats.
        refs.message = text('', 11, 34, 63, 292, 23, ink, 'center', 'body');
        refs.message.SetStyle({
          backgroundColor: K.paper,
          borderRadius: 10,
          opacity: 0,
          whiteSpace: 'nowrap'
        });
        AnchorGroup(page, 'top').AddChild(refs.message);
        app.refs.message = refs.message;
        app.refs.playTipBox = true;
        app.MountPage(page);
        g.playWidth = w;
        app.screen = 'game';
        g.selected = undefined;
        g.drag = undefined;
        g.queued = undefined;
      }

      // Pointer input on the board in board units (top-left origin), as urhox onPointerDown/Move/Up deliver page units.

      function bindPointer(board, h) {
        var n = board.node;
        var info = function info(e) {
          var _e$getID;
          var p = n.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(e.getUILocation().x, e.getUILocation().y, 0));
          return {
            x: p.x,
            y: -p.y,
            id: (_e$getID = e.getID()) != null ? _e$getID : 0,
            primary: true
          };
        };
        n.on(Node.EventType.TOUCH_START, function (e) {
          return h.PointerDown(info(e));
        });
        n.on(Node.EventType.TOUCH_MOVE, function (e) {
          return h.PointerMove(info(e));
        });
        n.on(Node.EventType.TOUCH_END, function (e) {
          return h.PointerUp(info(e));
        });
        n.on(Node.EventType.TOUCH_CANCEL, function () {
          return h.Cancel();
        });
      }
      function Refresh(app) {
        var _g$shownSnapshot, _bonus, _refs$orderValueTop$p, _refs$feedback$props$;
        var g = app.g;
        var run = g.run;
        var refs = g.play;
        var snapshot = (_g$shownSnapshot = g.shownSnapshot) != null ? _g$shownSnapshot : run.Snapshot();
        var score = Math.floor(snapshot.score);
        var scoreText = formatNumber(score);
        refs.score.SetText(scoreText);
        // Fitted so a 6-7 digit score keeps a gap after the "得分" caption.
        refs.score.SetStyle({
          fontSize: fitSize(scoreText, 16, 'sans', 42)
        });
        var exact = Remaining(app);
        var remaining = Math.ceil(exact);
        // The resume countdown shows the 3-2-1 itself; the plaque keeps the time then.
        var preparing = g.resumeDelay > 0 && !g.countdown;
        var two = function two(n) {
          return (n < 10 ? '0' : '') + n;
        };
        refs.time.SetText(preparing ? L('准备 {0}', Math.ceil(g.resumeDelay)) : two(Math.floor(remaining / 60)) + ":" + two(remaining % 60));
        refs.time.SetStyle({
          fontColor: exact < 10 ? red : ink,
          whiteSpace: 'nowrap'
        });
        var timeGain = g.timeCaptionLeft > 0 && g.timeCaption ? g.timeCaption : run.elapsed >= RECOVERY_FADE_END ? L('不再加时') : run.elapsed >= RECOVERY_FADE_START ? L('加时减弱') : '';
        refs.timeGain.SetText(timeGain);
        // One line in every language: the bold face at 9 pt, else the narrower body face.
        var _S$fitText = fitText(timeGain, 9, 'sans', 70),
          gainSize = _S$fitText[0],
          gainFamily = _S$fitText[1];
        refs.timeGain.SetStyle({
          fontColor: green,
          fontSize: gainSize,
          fontFamily: gainFamily,
          whiteSpace: 'nowrap'
        });
        refs.timeGainChip.SetStyle({
          backgroundColor: timeGain !== '' ? [232, 245, 215, 245] : [0, 0, 0, 0],
          borderColor: timeGain !== '' ? [101, 139, 67, 170] : [0, 0, 0, 0],
          borderWidth: timeGain !== '' ? 1 : 0
        });
        var presentation = g.presentation;
        var order = presentation.OrderView();
        var receipt = presentation.receipt;
        var completed = receipt !== undefined && (receipt.stage === 'hold' || receipt.stage === 'depart');
        // The stamp above already says "连续完成 N 单！", so the board title is always "完成".
        var orderTitle = completed ? L('完成') : L('第{0}单', order.index);
        refs.order.SetText(orderTitle);
        // Bold at every order number; at the 9 pt floor "第60单" is drawn up to 0.5 closer instead.
        var orderSize = fitSize(orderTitle, 15, 'sans', 38);
        var over = textWidth(orderTitle, orderSize, 'sans') - 38 * .96;
        var n = Array.from(orderTitle).length || 1;
        refs.order.SetStyle({
          fontSize: orderSize,
          fontFamily: 'sans',
          letterSpacing: over > 0 ? -Math.min(.5, over / Math.max(1, n - 1)) : 0
        });
        var _short = formatNumber;
        var progressText = _short(order.progress),
          targetText = _short(order.target);
        // Realistic range: at most ~60 orders a run, target <= 39120 (5 digits).
        var huge = order.target >= 100000;
        var digits = function digits(t) {
          return Array.from(t.split(',').join('')).length;
        };
        // Two lines (progress / "共 N") whenever one line does not fit the 54 column at the 9 pt floor.
        var oneLine = progressText + '/' + targetText;
        var stacked = !completed && (huge || digits(progressText) + digits(targetText) >= 9 || textWidth(oneLine, 9, 'sans') > 54 * .96);
        // After 00:00 a completed order adds no time; the board keeps the full progress.
        var orderValue = completed && ((_bonus = receipt.bonus) != null ? _bonus : 0) > 0 ? L('+{0} 秒', receipt.bonus.toFixed(1)) : oneLine;
        var valueLength = digits(progressText) + digits(targetText) + 1;
        refs.orderValue.SetText(orderValue);
        var valueFace = valueLength >= 11 ? 'body' : 'sans';
        refs.orderValue.SetStyle({
          whiteSpace: 'nowrap',
          fontFamily: valueFace,
          fontSize: fitSize(orderValue, 13, valueFace, 54),
          opacity: stacked ? 0 : 1
        });
        if (stacked && huge) refs.orderValueTop.SetText(L('还差 {0}', _short(Math.max(0, order.target - order.progress))));else refs.orderValueTop.SetText(progressText);
        // The second line names the target explicitly ("共" / "of") instead of a bare slash.
        refs.orderTotalWord.SetText(L('共'));
        refs.orderValueBottom.SetText(targetText);
        var topText = String((_refs$orderValueTop$p = refs.orderValueTop.props.text) != null ? _refs$orderValueTop$p : '');
        // Column 3 runs between the receipt's dashed dividers (x187-253): the total at 10 pt bold after a 9 pt "共".
        var word = L('共'),
          total = targetText;
        var wordW = textWidth(word, 9, 'body');
        var totalSize = Math.max(9, Math.min(10, fitSize(total, 10, 'sans', (62 - wordW - 1.5) / .92)));
        var totalW = textWidth(total, totalSize, 'sans');
        var x0 = 220 - (wordW + 1.5 + totalW) / 2;
        var shown = stacked ? 1 : 0;
        refs.orderValueTop.SetStyle({
          opacity: shown,
          whiteSpace: 'nowrap',
          fontSize: fitSize(topText, 10.5, 'sans', 58)
        });
        refs.orderTotalWord.SetStyle({
          opacity: shown,
          whiteSpace: 'nowrap',
          left: x0,
          width: wordW + 1
        });
        refs.orderValueBottom.SetStyle({
          opacity: shown,
          whiteSpace: 'nowrap',
          fontSize: totalSize,
          left: x0 + wordW + 1.5,
          width: totalW + 1
        });
        refs.progress.SetStyle({
          top: stacked ? 53 : 44,
          height: stacked ? 3 : 7
        });
        refs.progress.SetValue(Math.min(1, order.progress / order.target));
        var _presentation$OrderTr = presentation.OrderTransform(),
          offset = _presentation$OrderTr[0],
          opacity = _presentation$OrderTr[1];
        refs.orderCard.SetStyle({
          translateX: offset * g.playWidth * .9,
          opacity: opacity
        });
        var nextOrder = run.GetOrder(order.index + 1);
        var nextKey = nextOrder.preferences.join(':');
        if (refs.nextOrderKey !== nextKey) {
          refs.nextOrderKey = nextKey;
          refs.nextOrder.ClearChildren();
          centreRow(refs.nextOrder, nextOrder.preferences.map(function (kind) {
            return Art('ui.r02.tile.' + goods[kind - 1].id, 16, 16, goods[kind - 1].symbol);
          }), 2);
        }
        var prefKey = order.preferences.join(':');
        if (refs.preferenceKey !== prefKey) {
          refs.preferenceKey = prefKey;
          refs.preferences.ClearChildren();
          var items = order.preferences.map(function (kind) {
            return Art('ui.r02.tile.' + goods[kind - 1].id, 27, 27, goods[kind - 1].symbol);
          });
          // 21 wide: "×2" at 11 pt measures 19.5.
          items.push(UI.Label({
            minFontSize: 9,
            text: '×2',
            fontSize: 11,
            fontColor: ink,
            textAlign: 'center',
            fontFamily: 'sans',
            width: 21,
            height: 22,
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }));
          centreRow(refs.preferences, items, 3);
        }
        refs.catStates.forEach(function (state, i) {
          var cat = run.cats[i];
          if (cat) {
            state.name.SetText(L(Cat(cat.id).name));
            // The spent charge shows at the cat's release frame, not at activation (SkillItemVfx releaseAt).
            if (state.releaseAt === undefined) state.charge.SetValue(Math.min(1, cat.charge / CatLevel(cat.id, cat.level).charge), state.chargeCat !== cat);
            state.chargeCat = cat;
            state.skill.SetStyle({
              opacity: 1
            });
            state.badge.SetStyle({
              opacity: 1
            });
          } else {
            state.name.SetText(L('空位'));
            state.charge.SetValue(0);
            state.skill.SetStyle({
              opacity: .25
            });
            state.badge.SetStyle({
              opacity: .52
            });
          }
        });
        refs.buildState.SetText('');
        refs.buildState.SetStyle({
          opacity: 0
        });
        refs.feedback.SetStyle({
          opacity: 1
        });
        var feedbackText = String((_refs$feedback$props$ = refs.feedback.props.text) != null ? _refs$feedback$props$ : '');
        var comboPart, scorePart;
        var cc = g.lastChainCombo;
        if (cc && feedbackText === cc[0] + ' · ' + cc[1]) {
          comboPart = cc[0];
          scorePart = cc[1];
        }
        // Plain status copy fits one line; longer copy (other languages) is cut by measured width with an ellipsis.
        if (!comboPart && textWidth(feedbackText, 11.5, 'body') > 284) {
          var chars = Array.from(feedbackText);
          while (chars.length > 1 && textWidth(chars.join('') + '…', 11.5, 'body') > 284) chars.pop();
          feedbackText = chars.join('') + '…';
          refs.feedback.SetText(feedbackText);
        }
        // A real cascade reads as two levels: large orange "N连消" + smaller score pill (also during the resume countdown).
        var hot = comboPart !== undefined && (g.resumeDelay <= 0 || g.countdown !== undefined);
        refs.feedbackCombo.SetText(hot ? comboPart : '');
        refs.feedbackPill.SetText(hot ? scorePart : '');
        refs.feedbackCombo.SetStyle({
          opacity: hot ? 1 : 0
        });
        refs.feedbackPill.SetStyle({
          opacity: hot ? 1 : 0
        });
        // 'long' = at least as wide as 13 Chinese characters: 12 pt fitted to the strip's face.
        var _long = textWidth(feedbackText, 13, 'body') >= 13 * textWidth('一', 13, 'body') - .5; // i18n-ignore (measuring glyph)
        var _S$Face = Face('ui.play.chain_strip', 0, 0, 320, 34, 0),
          faceY = _S$Face[1],
          faceW = _S$Face[2],
          faceH = _S$Face[3];
        refs.feedback.SetStyle({
          opacity: hot ? 0 : 1,
          fontColor: ink,
          whiteSpace: 'nowrap',
          left: _long ? 18 : 8,
          width: _long ? 284 : 304,
          top: faceY + faceH / 2 - 13,
          height: 26,
          fontSize: _long ? fitSize(feedbackText, 11.5, 'sans', faceW - 16) : g.feedbackTime > 0 ? 14 : 13
        });
        if (g.resumeDelay > 0 && !g.countdown) {
          refs.feedback.SetText(L('准备继续 · {0}', Math.ceil(g.resumeDelay)));
          refs.feedback.SetStyle({
            fontSize: 12
          });
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/presentation.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, _extends, cclegacy, PRESENTATION;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      PRESENTATION = module.PRESENTATION;
    }],
    execute: function () {
      cclegacy._RF.push({}, "22d008UE4ZPm66kghARprQv", "presentation", undefined);
      function merge(a, b) {
        a.count += b.count;
        a.bonus += b.bonus;
        a.lastIndex = b.lastIndex;
      }
      var stageTime = function stageTime(stage) {
        return PRESENTATION[stage];
      };
      var Presentation = exports('Presentation', /*#__PURE__*/function () {
        function Presentation(snapshot) {
          this.snapshot = void 0;
          this.order = void 0;
          this.queue = [];
          this.events = [];
          this.fillAge = PRESENTATION.fill;
          this.fillFrom = void 0;
          this.receipt = void 0;
          this.pendingReceipt = void 0;
          this.snapshot = snapshot;
          this.order = snapshot;
          this.fillFrom = snapshot.progress;
        }
        // extra: presentation wait for a cat's wind-up (App.Events, 2026-10-15).
        var _proto = Presentation.prototype;
        _proto.Push = function Push(events, snapshot, extra) {
          if (extra === void 0) {
            extra = 0;
          }
          if (events.length === 0) return;
          var clear;
          for (var _iterator = _createForOfIteratorHelperLoose(events), _step; !(_step = _iterator()).done;) {
            var e = _step.value;
            if (e.type === 'clear') clear = e;
          }
          var delay = (clear ? PRESENTATION.delivery : .15) + extra;
          for (var _iterator2 = _createForOfIteratorHelperLoose(events), _step2; !(_step2 = _iterator2()).done;) {
            var _e = _step2.value;
            if (_e.type === 'order' || _e.type === 'time') this.queue.push({
              left: delay,
              event: _e,
              before: clear ? clear.snapshotBefore : this.snapshot
            });
          }
          var s = this.snapshot;
          if (clear || snapshot.score !== s.score || snapshot.index !== s.index || snapshot.progress !== s.progress || snapshot.preferences[0] !== s.preferences[0] || snapshot.preferences[1] !== s.preferences[1]) {
            this.queue.push({
              left: delay,
              event: {
                type: 'snapshot',
                value: clear ? clear.snapshotAfter : snapshot
              }
            });
          }
        };
        _proto.SetOrder = function SetOrder(snapshot) {
          var previous = this.OrderView();
          this.fillFrom = previous.index === snapshot.index ? previous.progress : snapshot.progress;
          this.fillAge = 0;
          this.order = snapshot;
        };
        _proto.StartReceipt = function StartReceipt(batch) {
          this.receipt = batch;
          batch.stage = 'fill';
          batch.age = 0;
          this.order = {
            index: batch.firstIndex,
            target: batch.target,
            preferences: batch.preferences,
            progress: batch.progress
          };
        }
        // Returns the receipt that now shows this batch's orders (order time belongs to that receipt).
        ;

        _proto.AddReceipt = function AddReceipt(batch) {
          var receipt = this.receipt;
          if (!receipt) {
            this.StartReceipt(batch);
            return batch;
          }
          if (receipt.stage === 'fill' || receipt.stage === 'hold') {
            merge(receipt, batch);
            if (receipt.stage === 'hold') this.events.push({
              type: 'receipt_merge',
              receipt: receipt
            });
            return receipt;
          }
          if (this.pendingReceipt) {
            merge(this.pendingReceipt, batch);
            return this.pendingReceipt;
          }
          this.pendingReceipt = batch;
          return batch;
        };
        _proto.OrderView = function (_OrderView) {
          function OrderView() {
            return _OrderView.apply(this, arguments);
          }
          OrderView.toString = function () {
            return _OrderView.toString();
          };
          return OrderView;
        }(function () {
          var result = _extends({}, this.order);
          var r = this.receipt;
          if (r && r.stage === 'fill') {
            var t = Math.min(1, r.age / PRESENTATION.fill);
            result.progress = r.progress + (r.target - r.progress) * (1 - Math.pow(1 - t, 3));
          } else if (r && (r.stage === 'hold' || r.stage === 'depart')) result.progress = result.target;else {
            var _t = Math.min(1, this.fillAge / PRESENTATION.fill);
            result.progress = this.fillFrom + (result.progress - this.fillFrom) * (1 - Math.pow(1 - _t, 3));
          }
          return result;
        });
        _proto.OrderTransform = function OrderTransform() {
          var r = this.receipt;
          if (r && r.stage === 'depart') {
            var t = Math.min(1, r.age / PRESENTATION.depart);
            return [-t * t, 1 - t];
          }
          if (r && r.stage === 'arrive') {
            var _t2 = Math.min(1, r.age / PRESENTATION.arrive);
            return [Math.pow(1 - _t2, 3), _t2];
          }
          return [0, 1];
        };
        _proto.Busy = function Busy() {
          return this.receipt !== undefined || this.pendingReceipt !== undefined || this.queue.length > 0;
        }
        // The result settle hold starts only once the order progress has finished filling.
        ;

        _proto.Settled = function Settled() {
          return !this.Busy() && this.fillAge >= PRESENTATION.fill;
        };
        _proto.PendingTime = function PendingTime() {
          var _r$orderTime, _this$pendingReceipt$;
          var total = 0;
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.queue), _step3; !(_step3 = _iterator3()).done;) {
            var item = _step3.value;
            if (item.event.type === 'time') total += item.event.amount;
          }
          // Order time waits on its own receipt until that receipt is sealed.
          var r = this.receipt;
          if (r && r.stage === 'fill') total += (_r$orderTime = r.orderTime) != null ? _r$orderTime : 0;
          if (this.pendingReceipt) total += (_this$pendingReceipt$ = this.pendingReceipt.orderTime) != null ? _this$pendingReceipt$ : 0;
          return total;
        };
        _proto.Update = function Update(dt) {
          this.fillAge += dt;
          var r = this.receipt;
          if (r) {
            r.age += dt;
            // Frame overshoot only advances the visual clock, never the Run clock.
            while (r && r.age >= stageTime(r.stage)) {
              r.age -= stageTime(r.stage);
              if (r.stage === 'fill') {
                r.stage = 'hold';
                this.events.push({
                  type: 'receipt_sealed',
                  receipt: r
                });
                this.FlushOrderTime(r);
              } else if (r.stage === 'hold') r.stage = 'depart';else if (r.stage === 'depart') {
                r.stage = 'arrive';
                var next = this.pendingReceipt;
                this.order = next ? {
                  index: next.firstIndex,
                  target: next.target,
                  preferences: next.preferences,
                  progress: next.progress
                } : this.snapshot;
                this.fillFrom = this.order.progress;
                this.fillAge = PRESENTATION.fill;
              } else {
                this.receipt = undefined;
                r = undefined;
                if (this.pendingReceipt) {
                  var _batch = this.pendingReceipt;
                  this.pendingReceipt = undefined;
                  this.StartReceipt(_batch);
                } else this.SetOrder(this.snapshot);
              }
            }
          }
          var waiting = [];
          var batch;
          var sources = [],
            amounts = {};
          var orderTime;
          var snapshotChanged = false;
          for (var _iterator4 = _createForOfIteratorHelperLoose(this.queue), _step4; !(_step4 = _iterator4()).done;) {
            var item = _step4.value;
            item.left -= dt;
            if (item.left > 0) {
              waiting.push(item);
              continue;
            }
            var e = item.event;
            if (e.type === 'snapshot') {
              this.snapshot = e.value;
              snapshotChanged = true;
            } else if (e.type === 'time' && e.source === '交单') {
              var _orderTime;
              // Order time shows when its own receipt is sealed, not while it fills and not on an earlier order's seal.
              orderTime = ((_orderTime = orderTime) != null ? _orderTime : 0) + e.amount;
            } else if (e.type === 'time') {
              var _ref;
              var source = (_ref = e.source) != null ? _ref : '消除';
              if (amounts[source] === undefined) {
                sources.push(source);
                amounts[source] = 0;
              }
              amounts[source] += e.amount;
            } else if (e.type === 'order') {
              var _ref2;
              var timeBonus = (_ref2 = e.timeBonus) != null ? _ref2 : 0;
              if (batch) {
                batch.count++;
                batch.bonus += timeBonus;
                batch.lastIndex = e.index;
              } else batch = {
                firstIndex: e.index,
                lastIndex: e.index,
                count: 1,
                bonus: timeBonus,
                target: e.target,
                preferences: item.before.preferences,
                progress: item.before.index === e.index ? item.before.progress : 0
              };
            }
          }
          this.queue = waiting;
          var holder;
          if (batch) holder = this.AddReceipt(batch);else if (snapshotChanged && !this.receipt) this.SetOrder(this.snapshot);
          if (sources.length > 0) this.events.push({
            type: 'time',
            sources: sources,
            amounts: amounts
          });
          if (orderTime !== undefined) {
            var _holder$orderTime;
            // Unsealed receipt (filling, or waiting behind the current one): it shows the time at its own seal.
            if (holder && (holder === this.pendingReceipt || holder.stage === 'fill')) holder.orderTime = ((_holder$orderTime = holder.orderTime) != null ? _holder$orderTime : 0) + orderTime;else this.FlushOrderTime({
              orderTime: orderTime
            });
          }
        };
        _proto.FlushOrderTime = function FlushOrderTime(receipt) {
          if (!receipt || receipt.orderTime === undefined) return;
          this.events.push({
            type: 'time',
            sources: ['交单'],
            amounts: {
              交单: receipt.orderTime
            }
          });
          receipt.orderTime = undefined;
        };
        _proto.DrainEvents = function DrainEvents() {
          var events = this.events;
          this.events = [];
          return events;
        };
        return Presentation;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/profile.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts', './i18n.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, SCORE_REWARD_DAILY_CAP, IsReleasedCat, CatLevelCost, DEMO, Points, DAILY_BONUS, AD_DAILY_CAP, AD_BONUS_FLOOR, AD_BONUS_STEPS, REROLL_AD_DAILY_CAP, REROLL_AD_AMOUNT, cats, retiredCats, INITIAL_POINTS, L;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      SCORE_REWARD_DAILY_CAP = module.SCORE_REWARD_DAILY_CAP;
      IsReleasedCat = module.IsReleasedCat;
      CatLevelCost = module.CatLevelCost;
      DEMO = module.DEMO;
      Points = module.Points;
      DAILY_BONUS = module.DAILY_BONUS;
      AD_DAILY_CAP = module.AD_DAILY_CAP;
      AD_BONUS_FLOOR = module.AD_BONUS_FLOOR;
      AD_BONUS_STEPS = module.AD_BONUS_STEPS;
      REROLL_AD_DAILY_CAP = module.REROLL_AD_DAILY_CAP;
      REROLL_AD_AMOUNT = module.REROLL_AD_AMOUNT;
      cats = module.cats;
      retiredCats = module.retiredCats;
      INITIAL_POINTS = module.INITIAL_POINTS;
    }, function (module) {
      L = module.L;
    }],
    execute: function () {
      exports({
        AdDay: AdDay,
        Day: Day,
        Now: Now,
        setClock: setClock,
        valid: valid
      });
      cclegacy._RF.push({}, "b4cb1cy8thIvYskwgD/PR12", "profile", undefined);
      var prices = {};
      for (var _iterator = _createForOfIteratorHelperLoose(cats), _step; !(_step = _iterator()).done;) {
        var cat = _step.value;
        prices[cat.id] = cat.cost;
      }
      for (var _iterator2 = _createForOfIteratorHelperLoose(retiredCats), _step2; !(_step2 = _iterator2()).done;) {
        var _cat = _step2.value;
        prices[_cat.id] = _cat.cost;
      }
      var keys = ['version', 'revision', 'points', 'best', 'cats', 'equipped', 'settings', 'tips', 'lastDailyDay', 'scoreRewardDay', 'scoreRewardCount', 'lastSettledRun', 'nextRun', 'adReceipts', 'adQuota', 'rerollAdReceipts', 'rerollAdQuota'];
      function copy(v) {
        return v === undefined ? v : JSON.parse(JSON.stringify(v));
      }
      function integer(v) {
        return typeof v === 'number' && v >= 0 && v < 9007199254740991 && Number.isInteger(v);
      }
      // Receipt and counter object keys are the integer as a string ("1", never "1.0").
      function adKey(v) {
        return String(Math.floor(v));
      }
      var AD_USER = 'current-profile';
      function validRerollReceipt(r) {
        var x = r;
        return typeof r === 'object' && r !== null && x.user === AD_USER && integer(x.run) && x.run > 0 && x.placement === 'reroll_bonus' && integer(x.requestId) && x.requestId > 0 && integer(x.quotaDate) && x.amount === REROLL_AD_AMOUNT;
      }
      function validReceipt(r) {
        var x = r;
        if (!(typeof r === 'object' && r !== null && x.user === AD_USER && integer(x.run) && x.run > 0 && x.placement === 'result_bonus' && integer(x.requestId) && x.requestId > 0 && integer(x.quotaDate) && integer(x.score) && x.score > 0 && integer(x.orders) && x.orders >= 1 && integer(x.amount) && x.amount > 0)) return false;
        // Receipts saved before 2026-10-08 keep their original half-share amount.
        if (x.bonusStep === undefined || x.bonusStep === null) return x.amount === Math.floor(Points(x.score) * 0.5);
        return integer(x.bonusStep) && AD_BONUS_STEPS[x.bonusStep - 1] !== undefined && x.amount === Math.floor(Math.max(Points(x.score), AD_BONUS_FLOOR) * AD_BONUS_STEPS[x.bonusStep - 1]);
      }
      var canonicalDay = function canonicalDay(day) {
        return integer(Number(day)) && String(Number(day)) === day;
      };
      function valid(d) {
        var x = d;
        if (typeof d !== 'object' || d === null || Array.isArray(d) || x.version !== 1) return false;
        for (var _i = 0, _arr = ['revision', 'points', 'best', 'lastSettledRun', 'nextRun']; _i < _arr.length; _i++) {
          var k = _arr[_i];
          if (!integer(x[k])) return false;
        }
        if (typeof x.lastDailyDay !== 'number' || !Number.isInteger(x.lastDailyDay) || x.lastDailyDay < -1) return false;
        if (x.scoreRewardDay !== undefined && x.scoreRewardDay !== -1 && !integer(x.scoreRewardDay)) return false;
        if (x.scoreRewardCount !== undefined && (!integer(x.scoreRewardCount) || x.scoreRewardCount > SCORE_REWARD_DAILY_CAP)) return false;
        var cats = x.cats;
        if (x.lastSettledRun > x.nextRun || typeof cats !== 'object' || cats === null || !cats.tuantuan) return false;
        for (var _i2 = 0, _Object$entries = Object.entries(cats); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _Object$entries[_i2],
            id = _Object$entries$_i[0],
            cat = _Object$entries$_i[1];
          if (prices[id] === undefined || typeof cat !== 'object' || cat === null || !integer(cat.level) || cat.level < 1 || cat.level > 5) return false;
        }
        var eq = x.equipped;
        if (!Array.isArray(eq) || eq.length < 1 || eq.length > 2) return false;
        var seen = {};
        for (var _iterator3 = _createForOfIteratorHelperLoose(eq), _step3; !(_step3 = _iterator3()).done;) {
          var _id = _step3.value;
          if (!cats[_id] || seen[_id]) return false;
          seen[_id] = true;
        }
        if (x.tips !== undefined) {
          if (typeof x.tips !== 'object' || x.tips === null || Array.isArray(x.tips)) return false;
          for (var _i3 = 0, _Object$entries2 = Object.entries(x.tips); _i3 < _Object$entries2.length; _i3++) {
            var _Object$entries2$_i = _Object$entries2[_i3],
              _k = _Object$entries2$_i[0],
              v = _Object$entries2$_i[1];
            if (!['skipped', '1', '2', '3', '4', '5'].includes(_k) || typeof v !== 'boolean') return false;
          }
        }
        var checkReceipts = function checkReceipts(receipts, quota, ok, maxRun, cap) {
          if (typeof receipts !== 'object' || receipts === null || typeof quota !== 'object' || quota === null) return false;
          var counts = {};
          for (var _i4 = 0, _Object$entries3 = Object.entries(receipts); _i4 < _Object$entries3.length; _i4++) {
            var _counts$day;
            var _Object$entries3$_i = _Object$entries3[_i4],
              key = _Object$entries3$_i[0],
              _r = _Object$entries3$_i[1];
            if (!ok(_r) || key !== adKey(_r.run) || _r.run > maxRun) return false;
            var day = adKey(_r.quotaDate);
            counts[day] = ((_counts$day = counts[day]) != null ? _counts$day : 0) + 1;
          }
          for (var _i5 = 0, _Object$entries4 = Object.entries(quota); _i5 < _Object$entries4.length; _i5++) {
            var _counts$_day;
            var _Object$entries4$_i = _Object$entries4[_i5],
              _day = _Object$entries4$_i[0],
              count = _Object$entries4$_i[1];
            if (!canonicalDay(_day) || !integer(count) || count > cap || count !== ((_counts$_day = counts[_day]) != null ? _counts$_day : 0)) return false;
          }
          for (var _i6 = 0, _Object$entries5 = Object.entries(counts); _i6 < _Object$entries5.length; _i6++) {
            var _Object$entries5$_i = _Object$entries5[_i6],
              _day2 = _Object$entries5$_i[0],
              _count = _Object$entries5$_i[1];
            if (quota[_day2] !== _count) return false;
          }
          return true;
        };
        if (x.adReceipts !== undefined || x.adQuota !== undefined) {
          if (!checkReceipts(x.adReceipts, x.adQuota, validReceipt, x.lastSettledRun, AD_DAILY_CAP)) return false;
        }
        if (x.rerollAdReceipts !== undefined || x.rerollAdQuota !== undefined) {
          if (!checkReceipts(x.rerollAdReceipts, x.rerollAdQuota, validRerollReceipt, x.nextRun, REROLL_AD_DAILY_CAP)) return false;
        }
        var s = x.settings;
        return typeof s === 'object' && s !== null && typeof s.music === 'boolean' && typeof s.sfx === 'boolean';
      }
      function equal(a, b) {
        if (typeof a !== typeof b || a === null !== (b === null)) return false;
        if (typeof a !== 'object' || a === null) return a === b;
        var ka = Object.keys(a),
          kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        return ka.every(function (k) {
          return equal(a[k], b[k]);
        });
      }
      var clock = function clock() {
        throw new Error('profile clock not installed');
      };
      // Seconds since the epoch; the platform installs a trusted source (server time) where it has one.
      function setClock(c) {
        clock = c;
      }
      function Now() {
        return clock();
      }
      function Day(nowEpoch) {
        return Math.floor((nowEpoch + 8 * 3600) / 86400);
      }
      function AdDay(nowEpoch) {
        var now = nowEpoch != null ? nowEpoch : Now();
        return integer(now) ? Day(now) : null;
      }
      var Profile = exports('Profile', /*#__PURE__*/function () {
        function Profile(storage) {
          this.version = 1;
          this.revision = 0;
          this.points = INITIAL_POINTS;
          this.best = 0;
          this.cats = {
            tuantuan: {
              level: 1
            }
          };
          this.equipped = ['tuantuan'];
          this.settings = {
            music: true,
            sfx: true
          };
          this.tips = {};
          this.lastDailyDay = -1;
          this.scoreRewardDay = -1;
          this.scoreRewardCount = 0;
          this.lastSettledRun = 0;
          this.nextRun = 0;
          this.loadError = undefined;
          this.activeSlot = 0;
          this.busy = false;
          this.adReceipts = {};
          this.adQuota = {};
          this.rerollAdReceipts = {};
          this.rerollAdQuota = {};
          this.storage = void 0;
          this.storage = storage;
        }
        var _proto = Profile.prototype;
        _proto.apply = function apply(data) {
          var _this$tips, _this$adReceipts, _this$adQuota, _this$scoreRewardDay, _this$scoreRewardCoun, _this$rerollAdReceipt, _this$rerollAdQuota;
          var self = this;
          for (var _i7 = 0, _keys = keys; _i7 < _keys.length; _i7++) {
            var k = _keys[_i7];
            self[k] = copy(data[k]);
          }
          (_this$tips = this.tips) != null ? _this$tips : this.tips = {};
          (_this$adReceipts = this.adReceipts) != null ? _this$adReceipts : this.adReceipts = {};
          (_this$adQuota = this.adQuota) != null ? _this$adQuota : this.adQuota = {};
          (_this$scoreRewardDay = this.scoreRewardDay) != null ? _this$scoreRewardDay : this.scoreRewardDay = -1;
          (_this$scoreRewardCoun = this.scoreRewardCount) != null ? _this$scoreRewardCoun : this.scoreRewardCount = 0;
          (_this$rerollAdReceipt = this.rerollAdReceipts) != null ? _this$rerollAdReceipt : this.rerollAdReceipts = {};
          (_this$rerollAdQuota = this.rerollAdQuota) != null ? _this$rerollAdQuota : this.rerollAdQuota = {};
        };
        Profile.Load = function Load(storage) {
          var self = new Profile(storage);
          var found = false;
          var errors = [];
          var hard = [];
          for (var _slot = 1; _slot <= 2; _slot++) {
            var _ok = true,
              d = void 0,
              err = void 0;
            try {
              var _storage$read = storage.read(_slot);
              d = _storage$read.data;
              err = _storage$read.error;
            } catch (e) {
              _ok = false;
              err = String(e);
            }
            if (_ok && d !== undefined && valid(d)) {
              if (!found || d.revision > self.revision) {
                self.apply(d);
                self.activeSlot = _slot;
                found = true;
              }
            } else if (!_ok || err || d !== undefined) {
              var _err;
              var message = (_err = err) != null ? _err : d !== undefined ? String(d) : '读取失败';
              errors.push(message);
              // An unreadable slot may hold the newer save; torn content can fall back to the other slot.
              if (!_ok || message === '无法读取存档' || message === '存档接口不可用') hard.push(message);
            }
          }
          if (hard.length > 0) self.loadError = L('存档读取失败，已禁止覆盖：{0}', hard.join('；'));else if (!found && errors.length > 0) self.loadError = L('存档读取失败，已禁止覆盖：{0}', errors.join('；'));
          return self;
        };
        _proto.Snapshot = function Snapshot() {
          var d = {};
          var self = this;
          for (var _i8 = 0, _keys2 = keys; _i8 < _keys2.length; _i8++) {
            var k = _keys2[_i8];
            d[k] = copy(self[k]);
          }
          return d;
        };
        _proto.Save = function Save() {
          var _written$error;
          if (this.loadError) return [false, this.loadError];
          var data = this.Snapshot();
          data.revision = this.revision + 1;
          if (!valid(data)) return [false, '存档内容无效'];
          var slot = this.activeSlot === 1 ? 2 : 1;
          var written;
          try {
            written = this.storage.write(slot, data);
          } catch (e) {
            return [false, String(e)];
          }
          if (!written.ok) return [false, (_written$error = written.error) != null ? _written$error : '保存失败'];
          // Read back the full value, not just revision, so short writes cannot grant rewards.
          var check;
          try {
            check = this.storage.read(slot).data;
          } catch (_unused) {
            return [false, '存档回读校验失败'];
          }
          if (!valid(check) || !equal(data, check)) return [false, '存档回读校验失败'];
          this.revision = data.revision;
          this.activeSlot = slot;
          return [true];
        };
        _proto.Commit = function Commit(change, callback) {
          if (this.busy || this.loadError) {
            var _this$loadError;
            var _err2 = (_this$loadError = this.loadError) != null ? _this$loadError : '存档正在保存，请稍候';
            callback == null || callback(false, _err2);
            return [false, _err2];
          }
          var before = this.Snapshot();
          this.busy = true;
          change();
          var _this$Save = this.Save(),
            ok = _this$Save[0],
            err = _this$Save[1];
          if (!ok) {
            var self = this;
            for (var _i9 = 0, _keys3 = keys; _i9 < _keys3.length; _i9++) {
              var k = _keys3[_i9];
              self[k] = before[k];
            }
          }
          this.busy = false;
          callback == null || callback(ok, err);
          return [ok, err];
        };
        _proto.NewRunId = function NewRunId() {
          var _this = this;
          var _this$Commit = this.Commit(function () {
              _this.nextRun = _this.nextRun + 1;
            }),
            ok = _this$Commit[0],
            err = _this$Commit[1];
          return ok ? [this.nextRun] : [null, err];
        };
        _proto.BuyCat = function BuyCat(id) {
          var _this2 = this;
          if (prices[id] === undefined) return [false, '未知猫咪'];
          if (!IsReleasedCat(id)) return [false, '后续开放'];
          if (this.cats[id]) return [false, '已经拥有'];
          if (this.points < prices[id]) return [false, '积分不足'];
          return this.Commit(function () {
            _this2.points = _this2.points - prices[id];
            _this2.cats[id] = {
              level: 1
            };
          });
        };
        _proto.LevelUp = function LevelUp(id) {
          var _this3 = this;
          var cat = this.cats[id];
          if (!cat) return [false, '尚未拥有'];
          if (cat.level >= 5) return [false, '亲密等级已满'];
          var price = CatLevelCost(id, cat.level);
          if (this.points < price) return [false, '积分不足'];
          return this.Commit(function () {
            _this3.points = _this3.points - price;
            _this3.cats[id].level = _this3.cats[id].level + 1;
          });
        };
        _proto.Equip = function Equip(id) {
          var _this4 = this;
          if (!this.cats[id]) return [false, '尚未拥有'];
          var index = this.equipped.indexOf(id);
          if (index >= 0 && this.equipped.length === 1) return [false, '至少保留一只猫咪'];
          if (index < 0 && this.equipped.length === 2) return [false, '最多上场两只，请先换下一只'];
          // Unreleased cats may still be taken off (ownership is kept), but never put on.
          if (index < 0 && !IsReleasedCat(id)) return [false, '后续开放'];
          return this.Commit(function () {
            if (index >= 0) _this4.equipped.splice(index, 1);else _this4.equipped.push(id);
          });
        };
        _proto.SetSetting = function SetSetting(key, value) {
          var _this5 = this;
          if (key !== 'music' && key !== 'sfx' || typeof value !== 'boolean') return [false, '设置无效'];
          return this.Commit(function () {
            _this5.settings[key] = value;
          });
        };
        _proto.MarkTip = function MarkTip(id, skipped) {
          var _this6 = this;
          if (!Number.isInteger(id) || id < 1 || id > 5 || typeof skipped !== 'boolean') return [false, '提示记录无效'];
          return this.Commit(function () {
            _this6.tips[String(id)] = true;
            if (skipped) _this6.tips.skipped = true;
          });
        };
        _proto.ReplaceCat = function ReplaceCat(id, slot) {
          var _this7 = this;
          if (!this.cats[id] || slot !== 1 && slot !== 2 || !this.equipped[slot - 1]) return [false, '伙伴位置无效'];
          if (!IsReleasedCat(id)) return [false, '后续开放'];
          if (this.equipped.includes(id)) return [false, '该伙伴已上场'];
          return this.Commit(function () {
            _this7.equipped[slot - 1] = id;
          });
        };
        _proto.Settle = function Settle(run, nowEpoch) {
          var _this8 = this;
          if (typeof run !== 'object' || !integer(run.id) || run.id < 1 || run.id > this.nextRun) return [false, '场次编号无效'];
          if (run.id <= this.lastSettledRun) return [false, '本局已经结算'];
          if (run.phase !== 'finished' || !integer(run.score) || !integer(run.completedOrders)) return [false, '本局尚未结束或成绩无效'];
          var now = nowEpoch != null ? nowEpoch : Now();
          if (!integer(now)) return [false, '时间无效'];
          var day = Day(now);
          var count = this.scoreRewardDay === day ? this.scoreRewardCount : 0;
          var base = !DEMO.on && count < SCORE_REWARD_DAILY_CAP ? Points(run.score) : 0;
          var daily = !DEMO.on && run.completedOrders >= 1 && day > this.lastDailyDay ? DAILY_BONUS : 0;
          var result = {
            base: base,
            daily: daily,
            total: base + daily,
            score: run.score
          };
          var _this$Commit2 = this.Commit(function () {
              _this8.points = _this8.points + base + daily;
              _this8.best = Math.floor(Math.max(_this8.best, run.score));
              _this8.lastSettledRun = run.id;
              _this8.scoreRewardDay = day;
              _this8.scoreRewardCount = count + (base > 0 ? 1 : 0);
              if (daily > 0) _this8.lastDailyDay = day;
            }),
            ok = _this$Commit2[0],
            err = _this$Commit2[1];
          return ok ? [true, result] : [false, err];
        };
        _proto.AdUsed = function AdUsed(day) {
          var _this$adQuota$adKey;
          return day !== null ? (_this$adQuota$adKey = this.adQuota[adKey(day)]) != null ? _this$adQuota$adKey : 0 : 0;
        };
        _proto.AdBonus = function AdBonus(score, nowEpoch) {
          if (DEMO.on || !integer(score) || score <= 0) return 0;
          var day = AdDay(nowEpoch != null ? nowEpoch : Now());
          if (day === null) return 0;
          var step = this.AdUsed(day) + 1;
          if (step > AD_DAILY_CAP) return 0;
          return Math.floor(Math.max(Points(score), AD_BONUS_FLOOR) * AD_BONUS_STEPS[step - 1]);
        };
        _proto.CreateAdReceipt = function CreateAdReceipt(run, requestId, nowEpoch) {
          var _this$loadError2;
          if (this.busy || this.loadError) return [null, (_this$loadError2 = this.loadError) != null ? _this$loadError2 : '存档正在保存，请稍候'];
          if (typeof run !== 'object' || !integer(run.id) || run.id < 1 || run.id > this.lastSettledRun || run.phase !== 'finished' || !integer(run.score) || !integer(run.completedOrders)) return [null, '本局尚未可靠结算'];
          var now = nowEpoch != null ? nowEpoch : Now();
          var day = AdDay(now);
          if (day === null) return [null, '时间无效'];
          if (this.adReceipts[adKey(run.id)]) return [null, '本局广告奖励已领取'];
          if (this.AdUsed(day) >= AD_DAILY_CAP) return [null, '今天的广告奖励已领完'];
          var r = {
            user: AD_USER,
            run: run.id,
            placement: 'result_bonus',
            requestId: requestId,
            quotaDate: day,
            score: run.score,
            orders: run.completedOrders,
            bonusStep: this.AdUsed(day) + 1,
            amount: this.AdBonus(run.score, now)
          };
          if (!validReceipt(r)) return [null, '本局没有可领取的广告奖励'];
          return [r];
        }
        // Only the successful Ads callback calls this. A failed save retries this SAME value.
        // Returns [true, existing receipt] when this exact grant was already saved, else the commit result (Lua parity).
        ;

        _proto.SaveAdReward = function SaveAdReward(receipt) {
          var _this$loadError3,
            _this9 = this;
          if (this.busy || this.loadError) return [false, (_this$loadError3 = this.loadError) != null ? _this$loadError3 : '存档正在保存，请稍候'];
          if (!validReceipt(receipt) || receipt.run > this.lastSettledRun) return [false, '广告收据无效'];
          var r = copy(receipt);
          var existing = this.adReceipts[adKey(r.run)];
          if (existing) {
            for (var _iterator4 = _createForOfIteratorHelperLoose(['user', 'run', 'placement', 'requestId', 'quotaDate', 'score', 'orders', 'amount', 'bonusStep']), _step4; !(_step4 = _iterator4()).done;) {
              var k = _step4.value;
              if (existing[k] !== r[k]) return [false, '本局广告奖励已领取'];
            }
            return [true, copy(existing)];
          }
          if (this.AdUsed(r.quotaDate) >= AD_DAILY_CAP) return [false, '今天的广告奖励已领完'];
          var _this$Commit3 = this.Commit(function () {
              _this9.points = _this9.points + r.amount;
              _this9.adReceipts[adKey(r.run)] = r;
              _this9.adQuota[adKey(r.quotaDate)] = _this9.AdUsed(r.quotaDate) + 1;
            }),
            ok = _this$Commit3[0],
            err = _this$Commit3[1];
          return [ok, err];
        };
        _proto.RerollAdUsed = function RerollAdUsed(day) {
          var _this$rerollAdQuota$a;
          return day !== null ? (_this$rerollAdQuota$a = this.rerollAdQuota[adKey(day)]) != null ? _this$rerollAdQuota$a : 0 : 0;
        };
        _proto.RerollAdRemaining = function RerollAdRemaining(nowEpoch) {
          var day = AdDay(nowEpoch);
          return day !== null ? Math.max(0, REROLL_AD_DAILY_CAP - this.RerollAdUsed(day)) : 0;
        };
        _proto.CreateRerollAdReceipt = function CreateRerollAdReceipt(run, requestId, nowEpoch) {
          var _this$loadError4;
          if (this.busy || this.loadError) return [null, (_this$loadError4 = this.loadError) != null ? _this$loadError4 : '存档正在保存，请稍候'];
          var grant = run && typeof run.CanGrantRerollAd === 'function' ? run.CanGrantRerollAd() : false;
          var canGrant = Array.isArray(grant) ? grant[0] : grant;
          if (typeof run !== 'object' || !integer(run.id) || run.id < 1 || run.id > this.nextRun || run.id <= this.lastSettledRun || !canGrant) {
            return [null, '本局无法领取重抽次数'];
          }
          var day = AdDay(nowEpoch);
          if (day === null) return [null, '时间无效'];
          if (this.rerollAdReceipts[adKey(run.id)]) return [null, '本局重抽广告已领取'];
          if (this.RerollAdUsed(day) >= REROLL_AD_DAILY_CAP) return [null, '今天的重抽广告已用完'];
          var r = {
            user: AD_USER,
            run: run.id,
            placement: 'reroll_bonus',
            requestId: requestId,
            quotaDate: day,
            amount: REROLL_AD_AMOUNT
          };
          if (!validRerollReceipt(r)) return [null, '重抽广告收据无效'];
          return [r];
        }
        // Receipt and daily counter commit together; retries keep the original request day and id.
        ;

        _proto.SaveRerollAdReward = function SaveRerollAdReward(receipt) {
          var _this$loadError5,
            _this10 = this;
          if (this.busy || this.loadError) return [false, (_this$loadError5 = this.loadError) != null ? _this$loadError5 : '存档正在保存，请稍候'];
          if (!validRerollReceipt(receipt) || receipt.run > this.nextRun) return [false, '重抽广告收据无效'];
          var r = copy(receipt);
          var existing = this.rerollAdReceipts[adKey(r.run)];
          if (existing) {
            for (var _iterator5 = _createForOfIteratorHelperLoose(['user', 'run', 'placement', 'requestId', 'quotaDate', 'amount']), _step5; !(_step5 = _iterator5()).done;) {
              var k = _step5.value;
              if (existing[k] !== r[k]) return [false, '本局重抽广告已领取'];
            }
            return [true, copy(existing)];
          }
          if (receipt.run <= this.lastSettledRun) return [false, '本局已结束'];
          if (this.RerollAdUsed(r.quotaDate) >= REROLL_AD_DAILY_CAP) return [false, '今天的重抽广告已用完'];
          var _this$Commit4 = this.Commit(function () {
              _this10.rerollAdReceipts[adKey(r.run)] = r;
              _this10.rerollAdQuota[adKey(r.quotaDate)] = _this10.RerollAdUsed(r.quotaDate) + 1;
            }),
            ok = _this$Commit4[0],
            err = _this$Commit4[1];
          return [ok, err];
        };
        return Profile;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/rerollAd.ts", ['cc', './ads.ts', './adLoading.ts', './profile.ts', './i18n.ts'], function (exports) {
  var cclegacy, HasSupport, IsAvailable, nextId, Request, Now, AdDay, L;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      HasSupport = module.HasSupport;
      IsAvailable = module.IsAvailable;
      nextId = module.nextId;
    }, function (module) {
      Request = module.Request;
    }, function (module) {
      Now = module.Now;
      AdDay = module.AdDay;
    }, function (module) {
      L = module.L;
    }],
    execute: function () {
      exports({
        BlocksChoice: BlocksChoice,
        Caption: Caption,
        Click: Click,
        Save: Save,
        State: State,
        Update: Update
      });
      cclegacy._RF.push({}, "d3f4f0OmoFDpoeLJIzm3L3L", "rerollAd", undefined); // Choice-screen rewarded rerolls, translated from the Maker repo scripts/Game/RerollAd.lua. Only Ads starts video and
      function State(app) {
        var _app$g;
        var run = (_app$g = app.g) == null ? void 0 : _app$g.run;
        if (!run || app.screen !== 'upgrade' || run.phase !== 'upgrade' || run.GetUpgradeChoices().length === 0) return undefined;
        if (!app.rerollAd || app.rerollAd.run !== run) app.rerollAd = {
          run: run,
          status: 'ready',
          page: app.page,
          hostRoot: app.root,
          remainingToday: 0,
          supported: false,
          visible: false
        };
        var state = app.rerollAd;
        // Later orders mount a fresh choice page for the same run: rebind only between requests.
        if (state.status !== 'playing' && state.status !== 'received' && state.status !== 'saving' && !state.cancelled) {
          state.page = app.page;
          state.hostRoot = app.root;
          if (state.status === 'abandoned') state.status = 'ready';
        }
        var now = Now();
        state.quotaDay = AdDay(now);
        state.remainingToday = app.profile.RerollAdRemaining(now);
        state.supported = HasSupport();
        if (state.status === 'ready' || state.status === 'used-up' || state.status === 'failed') {
          if (run.GetRerollAdUsed() || app.profile.rerollAdReceipts[String(Math.floor(run.id))]) state.status = 'done';else if (state.remainingToday <= 0) state.status = 'used-up';else if (state.status === 'used-up') state.status = 'ready';
        }
        state.visible = run.GetRerollRemaining() === 0 && !run.GetRerollAdUsed() && state.supported && state.status !== 'used-up' && state.status !== 'done';
        return state;
      }
      function current(app, state, profile) {
        var _app$g2;
        return !state.cancelled && app.screen === 'upgrade' && ((_app$g2 = app.g) == null ? void 0 : _app$g2.run) === state.run && app.profile === profile && state.run.phase === 'upgrade' && (!state.page || app.page === state.page && state.page.node.isValid) && (!state.hostRoot || app.root === state.hostRoot && state.hostRoot.node.isValid);
      }
      function refresh(app, state, profile) {
        if (current(app, state, profile)) app.refs.refreshRerollAd == null || app.refs.refreshRerollAd();
      }
      function failed(app, state, profile, message) {
        state.status = 'failed';
        state.message = message;
        state.failedUntil = app.clock + 2.4;
        refresh(app, state, profile);
      }
      function Save(app, state, profile) {
        if (state.status === 'saving' || !state.receipt || !current(app, state, profile)) return;
        if (profile.busy) {
          state.status = 'received';
          app.rerollAdPendingSave = {
            state: state,
            profile: profile
          };
          refresh(app, state, profile);
          return;
        }
        state.status = 'saving';
        state.message = undefined;
        refresh(app, state, profile);
        var _profile$SaveRerollAd = profile.SaveRerollAdReward(state.receipt),
          ok = _profile$SaveRerollAd[0];
        if (!current(app, state, profile)) {
          state.status = 'abandoned';
          return;
        }
        if (ok) {
          var _state$run$GrantRerol = state.run.GrantRerollAd(),
            granted = _state$run$GrantRerol[0],
            err = _state$run$GrantRerol[1];
          if (!granted) throw new Error('saved reroll grant must retain its choice phase: ' + err);
          state.status = 'done';
          state.message = undefined;
        } else {
          state.status = 'save-failed';
          state.locked = profile.loadError !== undefined;
          state.message = state.locked ? L('请重新进入核对') : L('重试保存');
        }
        refresh(app, state, profile);
      }
      function Click(app) {
        var state = State(app);
        if (!state || !state.visible) return;
        var profile = app.profile;
        if (state.status === 'save-failed') {
          if (!profile.loadError) Save(app, state, profile);
          return;
        }
        if (state.status !== 'ready' && state.status !== 'failed') return;
        if (!IsAvailable()) return;
        var _profile$CreateReroll = profile.CreateRerollAdReceipt(state.run, nextId + 1),
          receipt = _profile$CreateReroll[0],
          err = _profile$CreateReroll[1];
        if (!receipt) {
          failed(app, state, profile, L(String(err)));
          return;
        }
        state.status = 'playing';
        state.message = undefined;
        state.failedUntil = undefined;
        refresh(app, state, profile);
        var id = Request(app, 'reroll_bonus', function (result) {
          if (!current(app, state, profile)) return;
          if (!result.success) {
            failed(app, state, profile, result.reason === 'embed manual close' ? L('没看完广告') : L('广告暂不可用'));
            return;
          }
          state.receipt = receipt;
          state.status = 'received';
          Save(app, state, profile);
        });
        if (id === undefined && state.status === 'playing') failed(app, state, profile, L('广告暂不可用'));
      }
      function Caption(state) {
        if (state.status === 'failed' && state.message) return state.message;
        if (state.status === 'playing') return L('广告加载中…');
        if (state.status === 'saving' || state.status === 'received') return L('保存中…');
        if (state.status === 'save-failed') return state.locked ? L('请重新进入核对') : L('重试保存');
        return L('看广告 重抽+2');
      }
      function BlocksChoice(app) {
        var _app$g3;
        var state = app.rerollAd;
        return !!state && state.run === ((_app$g3 = app.g) == null ? void 0 : _app$g3.run) && (state.status === 'playing' || state.status === 'received' || state.status === 'saving');
      }
      function Update(app) {
        var pending = app.rerollAdPendingSave;
        if (pending && !pending.profile.busy) {
          app.rerollAdPendingSave = undefined;
          if (current(app, pending.state, pending.profile)) Save(app, pending.state, pending.profile);
        }
        var state = app.rerollAd;
        if (state && state.status === 'failed' && state.failedUntil !== undefined && app.clock >= state.failedUntil) {
          state.status = 'ready';
          state.message = undefined;
          state.failedUntil = undefined;
          refresh(app, state, app.profile);
        }
        if (state && current(app, state, app.profile) && (state.status === 'ready' || state.status === 'failed' || state.status === 'used-up')) {
          if (state.quotaDay !== AdDay() || state.supported !== HasSupport()) refresh(app, state, app.profile);
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/result.ts", ['cc', './kit.ts', './skin.ts', './design.ts', './paper.ts', './catView.ts', './config.ts', './resultAd.ts', './resultDetails.ts', './i18n.ts', './resultData.ts', './home.ts', './profile.ts', './audio.ts', './text.ts'], function (exports) {
  var cclegacy, UI, Image, Text, muted, ink, ShopBackground, AnchorGroup, Art, CatPlaceholder, colors, Label, Paper, Button, Create, DetachResult, DEMO, AD_DAILY_CAP, State, RewardTotal, Click, Caption, Open, L, Number, base, AdDay, playCue, textWidth, fitSize;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Text = module.Text;
      muted = module.muted;
      ink = module.ink;
    }, function (module) {
      ShopBackground = module.ShopBackground;
      AnchorGroup = module.AnchorGroup;
      Art = module.Art;
      CatPlaceholder = module.CatPlaceholder;
      colors = module.colors;
    }, function (module) {
      Label = module.Label;
      Paper = module.Paper;
      Button = module.Button;
    }, function (module) {
      Create = module.Create;
      DetachResult = module.DetachResult;
    }, function (module) {
      DEMO = module.DEMO;
      AD_DAILY_CAP = module.AD_DAILY_CAP;
    }, function (module) {
      State = module.State;
      RewardTotal = module.RewardTotal;
      Click = module.Click;
      Caption = module.Caption;
    }, function (module) {
      Open = module.Open;
    }, function (module) {
      L = module.L;
    }, function (module) {
      Number = module.Number;
    }, function (module) {
      base = module.base;
    }, function (module) {
      AdDay = module.AdDay;
    }, function (module) {
      playCue = module.playCue;
    }, function (module) {
      textWidth = module.textWidth;
      fitSize = module.fitSize;
    }],
    execute: function () {
      exports({
        Main: Main,
        Result: Result
      });
      cclegacy._RF.push({}, "95b0abtHVFMN6pSjHxdcr3L", "result", undefined);
      var K = colors;
      function place(widget, x, y, w, h) {
        widget.SetStyle({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h
        });
        return widget;
      }
      function rule(parent, x, y, w) {
        parent.AddChild(UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: 1,
          backgroundColor: [202, 172, 133, 255],
          pointerEvents: 'none'
        }));
      }
      // urhox UI.MeasureTextWidth takes the size in pixels.
      var measurePx = function measurePx(text, px) {
        return textWidth(text, px * .75, 'sans');
      };
      function Main(app, page, w, h, onDetails) {
        var g = app.g;
        var run = g.run;
        var ad = State(app);
        ShopBackground(page, w, h);
        var s = w / 390;
        // Type and artwork share the outer portrait canvas transform.
        var f = Math.max(s, 1);
        var margin = 18 * s,
          pw = w - 2 * margin,
          paperY = h * .355,
          paperH = h * .35;
        var fontScore = h / w < 1.9 ? 48 : 58;
        // The sign with its title follows the screen top on tall screens, the buttons the bottom.
        var sign = AnchorGroup(page, 'top');
        sign.AddChild(place(Art('ui.r02.timer', w * .6, h * .17), w * .2, 0, w * .6, h * .17));
        // A new record shows two lines (small "新纪录" over "好运满满") instead of one line running past the sign.
        if (g.newRecord) {
          sign.AddChild(Label(L('新纪录'), 13 * f, w * .23, h * .0835, w * .54, h * .022, true, K.red));
          sign.AddChild(Label(L('好运满满'), 22 * f, w * .23, h * .105, w * .54, h * .044, true));
        } else sign.AddChild(Label(L('今日营业完成'), 22 * f, w * .23, h * .0844, w * .54, h * .06, true));
        // The result paper stays in front of the fixed-root character layer.
        var catSize = Math.min(w * .31, paperY - h * .13);
        run.cats.forEach(function (cat, i) {
          var x = run.cats.length === 1 ? w * .20 : w * (i === 0 ? .16 : .60);
          var actor = Create(cat.id, cat.level, {
            x: x + catSize / 2,
            y: w * .65,
            slot: i + 1,
            context: 'ending',
            runToken: run
          });
          page.AddChild(actor != null ? actor : place(CatPlaceholder(cat.id, catSize, catSize), x, w * .65 - catSize, catSize, catSize));
        });
        var paper = UI.Panel({
          position: 'absolute',
          left: margin,
          top: paperY,
          width: pw,
          height: paperH
        });
        paper.AddChild(place(Paper('ui.result.paper', pw, paperH), 0, 0, pw, paperH));
        paper.AddChild(place(Art('ui.result.clip', 20 * s, 36 * s), pw / 2 - 10 * s, -17 * s, 20 * s, 36 * s));
        // +3: the 18-pt caption is taller than its box; keep its text 6+ below the paper's top edge at every scale.
        paper.AddChild(Label(L('本局得分'), 18 * f, 20 * s, paperH * .05 + 3, pw - 40 * s, paperH * .10, true));
        var scoreText = Number(run.score);
        var scoreSize = fontScore * f * Math.min(1, (pw - 44 * s) / Math.max(1, measurePx(scoreText, fontScore * f)));
        var score = Label(scoreText, scoreSize, 22 * s, paperH * .15, pw - 44 * s, paperH * .24, true);
        paper.AddChild(score);
        app.refs.resultScore = score;
        rule(paper, 16 * s, paperH * .40, pw - 32 * s);
        var m = run.metrics;
        var records = [['ui.result.icon.order', L('{0} 单', Number(run.completedOrders)), L('完成订单')], ['fx.star', L('{0} 连消', Number(m.maxCascade)), L('最大连消')], ['icon.points', Number(m.maxChainScore), L('最高连消分')]];
        records.forEach(function (record, i) {
          var cw = (pw - 28 * s) / 3,
            x = 14 * s + i * cw;
          paper.AddChild(place(Art(record[0], 30 * s, 30 * s), x + cw / 2 - 15 * s, paperH * .425, 30 * s, 30 * s));
          var value = Label(record[1], 21 * f * Math.min(1, (cw - 4 * s) / Math.max(1, measurePx(record[1], 21 * f))), x, paperH * .58, cw, paperH * .12, true);
          if (i === 1 && m.maxCascade <= 1) value.SetStyle({
            fontColor: K.muted
          });
          paper.AddChild(value);
          paper.AddChild(Label(record[2], 13 * f, x, paperH * .70, cw, paperH * .09, false));
          if (i < 2) {
            var top = paperH * .425 + 4 * s,
              bottom = paperH * .79 - 4 * s;
            paper.AddChild(UI.Panel({
              position: 'absolute',
              left: x + cw - .5,
              top: top,
              width: 1,
              height: bottom - top,
              backgroundColor: [202, 172, 133, 255],
              pointerEvents: 'none'
            }));
          }
        });
        // The footer gets its own band (0.80-1.0), text vertically centred with inner padding.
        rule(paper, 16 * s, paperH * .80, pw - 32 * s);
        var fy = paperH * .80 + 2 * s,
          fh = paperH - fy - 10 * s;
        paper.AddChild(Label(L('道具 +{0}', Number(m.contributions.item)), 13 * f, 26 * s, fy, pw * .30, fh, false, undefined, 'left'));
        paper.AddChild(Label(L('猫咪 +{0}', Number(m.contributions.pet)), 13 * f, pw * .37, fy, pw * .30, fh, false, undefined, 'left'));
        // The hit area is at least 44 logical units tall regardless of the page scale s.
        var hitH = Math.max(44, 44 * s);
        var detail = UI.Button({
          position: 'absolute',
          left: pw * .72 - 6 * s,
          top: paperH - hitH - 4 * s,
          width: pw * .28 - 12 * s,
          height: hitH,
          onClick: function onClick() {
            playCue('sfx.click');
            onDetails();
          }
        });
        var chip = UI.Panel({
          position: 'absolute',
          left: 4 * s,
          top: hitH - fh - 2 * s,
          width: pw * .28 - 20 * s,
          height: fh - 8 * s,
          borderRadius: 8 * s,
          backgroundColor: [255, 244, 220, 255],
          borderWidth: 1.2,
          borderColor: [150, 104, 62, 255],
          pointerEvents: 'none'
        });
        chip.AddChild(Label(L('明细 ›'), 14 * f, 0, 0, pw * .28 - 20 * s, fh - 8 * s, true));
        detail.AddChild(chip);
        paper.AddChild(detail);
        app.refs.resultDetails = detail;
        page.AddChild(paper);
        app.refs.resultPaper = paper;
        // 76 tall: the paper's frame is ~8 at this width, and the three lines need 6/3 clearance inside it.
        var ry = h * .735 - (ad ? 22 : 0),
          rh = Math.max(76 * f, Math.min(80 * s, h * .12));
        page.AddChild(place(Art('ui.result.reward_matatabi', pw * .28, rh), margin, ry, pw * .28, rh));
        var rx = margin + pw * .30,
          rw = pw * .70;
        var reward = UI.Panel({
          position: 'absolute',
          left: rx,
          top: ry,
          width: rw,
          height: rh
        });
        reward.AddChild(place(Paper('ui.result.paper', rw, rh), 0, 0, rw, rh));
        var settlement = g.settlement;
        if (settlement) {
          // Texts keep 6 inside the paper's frame (x 18).
          reward.AddChild(Image('ui.icon.points_matatabi', 18 * s, 14 * f, 14 * f, 14 * f));
          var total = Label(L('养猫积分 +{0}', Number(RewardTotal(app, ad))), 20 * f, 18 * s + 18 * f, 9 * f, rw - 30 * s - 18 * f, 24 * f, true, undefined, 'left');
          reward.AddChild(total);
          app.refs.resultRewardTotal = total;
          var daily = settlement.daily > 0 ? L('今日首次 +{0}', settlement.daily) : run.completedOrders > 0 ? L('今日首次已领取') : L('完成一单可领首次奖励');
          var exchange = settlement.base === 0 ? L('今日前 10 局已领过成绩积分') : L('成绩兑换 +{0}', Number(settlement.base));
          // Longer languages ("Finish an order for the first-run bonus") may go half a point below the 9 pt floor.
          // The demo earns nothing by design: these reasons for a zero would be untrue there, so they are left out.
          if (!DEMO.on) for (var _i = 0, _arr = [[exchange, 35 * f], [daily, 49 * f]]; _i < _arr.length; _i++) {
            var _arr$_i = _arr[_i],
              copy = _arr$_i[0],
              top = _arr$_i[1];
            var line = Label(copy, 12 * f, 18 * s, top, rw - 30 * s, 16 * f, false, K.muted, 'left');
            line.SetStyle({
              minFontSize: 8.5
            });
            reward.AddChild(line);
          }
        } else {
          reward.AddChild(Label(g.settleError ? L('积分尚未保存') : L('正在保存积分…'), 18 * f, 18 * s, 9 * f, rw - 30 * s, 26 * f, true, g.settleError ? K.red : undefined, 'left'));
          var note = Label(g.settleError ? L('请重试，账单仍在本局保留') : L('正在收好这一局的好运'), 12 * f, 18 * s, 37 * f, rw - 30 * s, rh - 45 * f, false, K.muted, 'left');
          // A note that does not fit one line at 9 pt (Japanese) wraps onto the second line the box has room for.
          if (textWidth(String(note.props.text), 9, 'body') > rw - 30 * s) note.SetStyle({
            whiteSpace: 'normal',
            lineHeight: 1.15,
            verticalAlign: 'top'
          });
          reward.AddChild(note);
        }
        page.AddChild(reward);
        app.refs.resultReward = reward;
        var by = ad ? ry + rh + 56 : Math.min(h * .875, h - 64 * s);
        var bh = Math.max(44 * f, 52 * s);
        var actions = UI.Panel({
          position: 'absolute',
          left: margin,
          top: by,
          width: pw,
          height: bh
        });
        if (settlement) {
          var bw = (pw - 12 * s) / 2;
          var home = Button(L('回猫窝'), app.Cats, bw, bh, true, false, 20 * f);
          var replay = Button(L('再营业一次'), app.NewGame, bw, bh, false, false, 20 * f);
          actions.AddChild(place(home, 0, 0, bw, bh));
          actions.AddChild(place(replay, bw + 12 * s, 0, bw, bh));
          app.refs.resultActions = [home, replay];
        } else {
          var retry = Button(g.settleError ? L('重试保存') : L('保存中'), app.Finish, pw, bh, false, !g.settleError, 20 * f);
          actions.AddChild(retry);
          app.refs.resultActions = [retry];
        }
        var dock = AnchorGroup(page, 'bottom');
        dock.AddChild(actions);
        app.refs.dock = actions;
        if (ad) {
          var ay = ry + rh + 6;
          var disabled = ad.status === 'playing' || ad.status === 'done' || ad.status === 'used-up' || ad.status === 'saving' || ad.status === 'save-failed' && app.profile.loadError !== undefined;
          var button = UI.Button({
            position: 'absolute',
            left: margin,
            top: ay,
            width: pw,
            height: 44,
            disabled: disabled,
            onClick: function onClick() {
              playCue('sfx.click');
              Click(app);
            }
          });
          button.AddChild(place(Paper('ui.result.ad_button', pw, 44), 0, 0, pw, 44));
          if (disabled) button.AddChild(UI.Panel({
            position: 'absolute',
            left: 3,
            top: 3,
            width: pw - 6,
            height: 38,
            backgroundColor: [176, 166, 150, 255],
            borderRadius: 11,
            pointerEvents: 'none'
          }));
          button.AddChild(Image(ad.status === 'done' ? 'ui.icon.ad_done' : 'ui.icon.ad_video', 16, 10, 24, 24));
          var failure = ad.status === 'failed' && ad.message !== undefined;
          var _copy = Caption(ad);
          var family = failure ? 'body' : 'sans',
            minSize = failure ? 9 : 14;
          // Other languages ("Watch ad: +286 points") may go below the Chinese minimum, to 11 pt, instead of clipping.
          var _base = Math.max(minSize, fitSize(_copy, ad.status === 'used-up' || failure ? 14 : 16, family, pw - 140));
          var size = textWidth(_copy, _base, family) <= pw - 140 ? _base : Math.max(11, Math.min(_base, (pw - 140) / textWidth(_copy, 1, family)));
          var caption = Text(_copy, size, 48, 0, pw - 140, 44, disabled ? muted : failure ? [190, 70, 50, 255] : ink, 'center', family);
          caption.SetStyle({
            minFontSize: Math.min(minSize, size),
            letterSpacing: ad.status === 'used-up' ? -.5 : 0
          });
          button.AddChild(caption);
          app.refs.resultAdCaption = caption;
          button.AddChild(Image('ui.cats.selector.tag.ready', pw - 82, 10, 70, 24));
          if (disabled) button.AddChild(UI.Panel({
            position: 'absolute',
            left: pw - 82,
            top: 10,
            width: 70,
            height: 24,
            backgroundColor: [176, 166, 150, 255],
            borderRadius: 7,
            pointerEvents: 'none'
          }));
          // The receipt keeps its creation day; the "today" tag always describes today's counter.
          var used = app.profile.AdUsed(AdDay());
          button.AddChild(Text(L('今日 {0}/{1}', Math.max(0, AD_DAILY_CAP - used), AD_DAILY_CAP), 11, pw - 82, 10, 70, 24, disabled ? muted : ink, 'center', 'body'));
          dock.AddChild(button);
          app.refs.resultAdButton = button;
        }
        if (settlement && app.resultPresentedRun !== run) {
          app.resultPresentedRun = run;
          paper.Animate({
            keyframes: {
              0: {
                opacity: 0,
                translateY: 18 * s
              },
              1: {
                opacity: 1,
                translateY: 0
              }
            },
            duration: .42,
            easing: 'easeOut',
            fillMode: 'both'
          });
          reward.Animate({
            keyframes: {
              0: {
                opacity: 0,
                translateY: 8 * s
              },
              1: {
                opacity: 1,
                translateY: 0
              }
            },
            duration: .38,
            delay: .18,
            easing: 'easeOut',
            fillMode: 'both'
          });
        }
        return paper;
      }
      function Result(app) {
        var _base2 = base(app, 'result', undefined, DetachResult(app.g.run)),
          page = _base2[0],
          w = _base2[1],
          h = _base2[2];
        Main(app, page, w, h, function () {
          return Open(app);
        });
        app.MountPage(page);
        if (app.resultDetails) Open(app, true);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resultAd.ts", ['cc', './config.ts', './ads.ts', './adLoading.ts', './profile.ts', './i18n.ts', './text.ts'], function (exports) {
  var cclegacy, AD_DAILY_CAP, HasSupport, IsAvailable, nextId, Request, Now, AdDay, L, formatNumber;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      AD_DAILY_CAP = module.AD_DAILY_CAP;
    }, function (module) {
      HasSupport = module.HasSupport;
      IsAvailable = module.IsAvailable;
      nextId = module.nextId;
    }, function (module) {
      Request = module.Request;
    }, function (module) {
      Now = module.Now;
      AdDay = module.AdDay;
    }, function (module) {
      L = module.L;
    }, function (module) {
      formatNumber = module.formatNumber;
    }],
    execute: function () {
      exports({
        Caption: Caption,
        Click: Click,
        RewardTotal: RewardTotal,
        Save: Save,
        State: State,
        Update: Update
      });
      cclegacy._RF.push({}, "ee7c1XSegJE86sxHeFoHlEf", "resultAd", undefined);
      var ZW = '​';
      var hiddenLogged;
      function State(app) {
        var _app$g;
        var run = (_app$g = app.g) == null ? void 0 : _app$g.run;
        if (!run || !app.g.settlement || run.completedOrders < 1 || run.score <= 0) return undefined;
        if (!HasSupport()) {
          if (hiddenLogged !== run) {
            hiddenLogged = run;
            console.log('[Ads] result entry hidden: no ad adapter');
          }
          return undefined;
        }
        if (!app.resultAd || app.resultAd.run !== run) app.resultAd = {
          run: run,
          status: 'ready'
        };
        var state = app.resultAd;
        if (state.status === 'ready' || state.status === 'used-up' || state.status === 'failed') {
          var now = Now();
          var saved = app.profile.adReceipts[String(Math.floor(run.id))];
          if (saved) {
            state.status = 'done';
            state.amount = saved.amount;
          } else if (app.profile.AdUsed(AdDay(now)) >= AD_DAILY_CAP) state.status = 'used-up';else {
            if (state.status === 'used-up') state.status = 'ready';
            state.amount = app.profile.AdBonus(run.score, now);
          }
        }
        return state;
      }
      function refresh(app, state, profile) {
        var _app$g2;
        // A new game owns a different run object; no captured widget is touched.
        if (app.screen === 'result' && ((_app$g2 = app.g) == null ? void 0 : _app$g2.run) === state.run && app.profile === profile) {
          app.Result();
          if (state.message && state.status !== 'failed') app.Toast(state.message);
        }
      }
      function failed(app, state, profile, message) {
        state.status = 'failed';
        state.message = message;
        state.failedUntil = app.clock + 2.4;
        refresh(app, state, profile);
      }
      function Save(app, state, profile) {
        if (state.status === 'saving' || !state.receipt) return;
        state.status = 'saving';
        state.message = undefined;
        refresh(app, state, profile);
        // A player may leave and start saving a new run id while the old video completes: wait for that write.
        if (profile.busy) {
          app.adPendingSave = {
            state: state,
            profile: profile
          };
          return;
        }
        var _profile$SaveAdReward = profile.SaveAdReward(state.receipt),
          ok = _profile$SaveAdReward[0];
        state.status = ok ? 'done' : 'save-failed';
        state.locked = !ok && profile.loadError !== undefined;
        if (ok) state.rollStarted = app.clock;else if (profile.loadError) state.message = L('存档结果未确认，' + ZW + '请退出游戏后重新进入核对');else state.message = L('奖励尚未保存，' + ZW + '请重试保存');
        refresh(app, state, profile);
      }
      function Click(app) {
        var state = State(app);
        if (!state) return;
        var profile = app.profile;
        if (state.status === 'save-failed') {
          if (!profile.loadError) Save(app, state, profile);
          return;
        }
        if (state.status !== 'ready' && state.status !== 'failed') return;
        if (!IsAvailable()) return;
        // ShowRewarded can complete synchronously; prepare the exact id and creation date first.
        var _profile$CreateAdRece = profile.CreateAdReceipt(state.run, nextId + 1),
          receipt = _profile$CreateAdRece[0],
          err = _profile$CreateAdRece[1];
        if (!receipt) {
          state.message = L(String(err));
          refresh(app, state, profile);
          return;
        }
        state.amount = receipt.amount;
        state.status = 'playing';
        state.message = undefined;
        state.failedUntil = undefined;
        refresh(app, state, profile);
        var id = Request(app, 'result_bonus', function (result) {
          if (!result.success) {
            failed(app, state, profile, result.reason === 'embed manual close' ? L('没看完广告，' + ZW + '奖励没有发放') : L('广告暂时不可用，' + ZW + '稍后再试'));
            return;
          }
          state.receipt = receipt;
          state.status = 'received';
          Save(app, state, profile);
        });
        if (id === undefined && state.status === 'playing') failed(app, state, profile, L('广告暂时不可用，' + ZW + '稍后再试'));
      }
      function Caption(state) {
        if (state.status === 'failed' && state.message) return state.message;
        if (state.status === 'playing') return L('广告加载中…');
        if (state.status === 'saving') return L('保存中…');
        if (state.status === 'save-failed') return state.locked ? L('请重新进入核对') : L('重试保存');
        if (state.status === 'done') return L('已领取 +{0}', state.amount);
        if (state.status === 'used-up') return L('今天的广告奖励已领完');
        return L('看广告 再领+{0}积分', state.amount);
      }
      function RewardTotal(app, state) {
        var _state$amount;
        var base = app.g.settlement.total;
        if (!state || state.status !== 'done') return base;
        var progress = state.rollStarted !== undefined ? Math.min(1, Math.max(0, (app.clock - state.rollStarted) / .4)) : 1;
        return base + Math.floor(((_state$amount = state.amount) != null ? _state$amount : 0) * progress + .5);
      }
      function Update(app) {
        var _app$g4;
        var pending = app.adPendingSave;
        if (pending && !pending.profile.busy) {
          app.adPendingSave = undefined;
          pending.state.status = 'received';
          Save(app, pending.state, pending.profile);
        }
        var state = app.resultAd;
        if (state && state.status === 'failed' && state.failedUntil !== undefined && app.clock >= state.failedUntil) {
          var _app$g3;
          state.message = undefined;
          state.failedUntil = undefined;
          var caption = app.refs.resultAdCaption;
          if (app.screen === 'result' && state.run === ((_app$g3 = app.g) == null ? void 0 : _app$g3.run) && caption) {
            caption.SetText(Caption(state));
            caption.SetStyle({
              fontColor: [92, 58, 30, 255],
              fontSize: 16
            });
          }
        }
        var total = app.refs.resultRewardTotal;
        if (app.screen === 'result' && state && state.run === ((_app$g4 = app.g) == null ? void 0 : _app$g4.run) && state.status === 'done' && state.rollStarted !== undefined && total) {
          total.SetText(L('养猫积分 +{0}', formatNumber(RewardTotal(app, state))));
          if (app.clock - state.rollStarted >= .4) state.rollStarted = undefined;
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resultData.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts', './i18n.ts', './text.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, Cat, cats, retiredCats, Upgrade, ItemText, upgrades, L, formatNumber;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      Cat = module.Cat;
      cats = module.cats;
      retiredCats = module.retiredCats;
      Upgrade = module.Upgrade;
      ItemText = module.ItemText;
      upgrades = module.upgrades;
    }, function (module) {
      L = module.L;
    }, function (module) {
      formatNumber = module.formatNumber;
    }],
    execute: function () {
      exports('FromRun', FromRun);
      cclegacy._RF.push({}, "60ff6b0bBVEe67PepW6KFe9", "resultData", undefined);
      var Number = exports('Number', formatNumber);
      var ZW = '​';
      var auxiliary = {
        ribbon_cross: '范围辅助',
        bake_tray: '范围辅助',
        display_feature: '偏好辅助',
        display_filter: '补货辅助',
        general_hourglass: '加时辅助',
        general_stamp: '订单辅助',
        ribbon_wide: '范围辅助',
        display_sample: '偏好辅助',
        bake_fuse: '能量辅助'
      };
      function itemRow(run, id, replaced) {
        var _m$sources$source, _m$generated$source, _m$converted$source, _auxiliary$id;
        var def = Upgrade(id);
        var m = run.metrics;
        var source = 'item:' + id;
        var score = (_m$sources$source = m.sources[source]) != null ? _m$sources$source : 0,
          generated = (_m$generated$source = m.generated[source]) != null ? _m$generated$source : 0,
          converted = (_m$converted$source = m.converted[source]) != null ? _m$converted$source : 0;
        var note = ItemText(L(def.description));
        if (def.refillKind !== undefined) note = L('补货权重 ×{0}', def.refillMultiplier);else if (generated > 0) note = def.route === 'bake' ? L('本局生成' + ZW + '{0} 枚炸弹', Number(generated)) : L('本局生成' + ZW + '{0} 个线消', Number(generated));else if (converted > 0) note = L('本局换成偏好品' + ZW + ' {0} 件', Number(converted));
        return {
          id: id,
          name: L(def.name),
          note: note,
          replaced: replaced,
          score: score,
          value: score > 0 ? L('+{0} 分', Number(score)) : L(def.refillKind !== undefined ? '补货辅助' : (_auxiliary$id = auxiliary[id]) != null ? _auxiliary$id : '0 分'),
          numeric: score > 0 || def.refillKind === undefined && !auxiliary[id],
          upgrade: def
        };
      }
      function FromRun(run) {
        var m = run.metrics;
        var data = {
          score: run.score,
          scores: [],
          items: [],
          replaced: [],
          cats: [],
          time: [],
          timeTenths: 0
        };
        // Current-style art only: r02 goods, the cats-page avatars, item icons.
        for (var _i = 0, _arr = [['base', '基础消除', 'ui.r02.tile.yarn'], ['item', '道具贡献', 'upgrade.bake_foam'], ['pet', '猫咪贡献', 'cat.' + ((_run$cats$0$id = (_run$cats$ = run.cats[0]) == null ? void 0 : _run$cats$.id) != null ? _run$cats$0$id : 'tuantuan') + '.selector']]; _i < _arr.length; _i++) {
          var _run$cats$0$id, _run$cats$;
          var _arr$_i = _arr[_i],
            key = _arr$_i[0],
            name = _arr$_i[1],
            icon = _arr$_i[2];
          var score = m.contributions[key];
          data.scores.push({
            name: L(name),
            value: Number(score),
            score: score,
            icon: icon
          });
        }
        for (var _iterator = _createForOfIteratorHelperLoose(run.upgradeOrder), _step; !(_step = _iterator()).done;) {
          var id = _step.value;
          data.items.push(itemRow(run, id, false));
        }
        for (var _iterator2 = _createForOfIteratorHelperLoose(upgrades), _step2; !(_step2 = _iterator2()).done;) {
          var _m$sources$source2, _m$generated$source2, _m$converted$source2;
          var def = _step2.value;
          var source = 'item:' + def.id;
          if (!run.ownedUpgrades[def.id] && (((_m$sources$source2 = m.sources[source]) != null ? _m$sources$source2 : 0) > 0 || ((_m$generated$source2 = m.generated[source]) != null ? _m$generated$source2 : 0) > 0 || ((_m$converted$source2 = m.converted[source]) != null ? _m$converted$source2 : 0) > 0)) data.replaced.push(itemRow(run, def.id, true));
        }
        for (var _iterator3 = _createForOfIteratorHelperLoose(run.cats), _step3; !(_step3 = _iterator3()).done;) {
          var _m$sources;
          var cat = _step3.value;
          var _score = (_m$sources = m.sources['pet:' + cat.id]) != null ? _m$sources : 0;
          data.cats.push({
            id: cat.id,
            name: L(Cat(cat.id).name),
            icon: 'cat.' + cat.id + '.selector',
            note: L('自动助力 {0} 次', cat.uses),
            value: L('+{0} 分', Number(_score)),
            score: _score,
            numeric: true
          });
        }
        var order = {
          消除: 1,
          连消: 2,
          交单: 3
        };
        cats.forEach(function (cat, i) {
          order[cat.name] = 4 + i;
        });
        retiredCats.forEach(function (cat, i) {
          order[cat.name] = 4 + cats.length + i;
        });
        var sources = Object.keys(m.time).sort(function (a, b) {
          return order[a] - order[b];
        });
        for (var _iterator4 = _createForOfIteratorHelperLoose(sources), _step4; !(_step4 = _iterator4()).done;) {
          var _source = _step4.value;
          var tenths = Math.floor(m.time[_source] * 10 + .5);
          if (tenths > 0) {
            data.time.push({
              name: L(_source),
              value: L('+{0} 秒', (tenths / 10).toFixed(1)),
              tenths: tenths
            });
            data.timeTenths += tenths;
          }
        }
        return data;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resultDetails.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './skin.ts', './design.ts', './paper.ts', './config.ts', './i18n.ts', './resultData.ts', './audio.ts', './text.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, UI, Block, Art, Label$1, colors, UpgradeArt, Paper, Label, Button, goods, L, Number, FromRun, playCue, textWidth;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Block = module.Block;
    }, function (module) {
      Art = module.Art;
      Label$1 = module.Label;
      colors = module.colors;
      UpgradeArt = module.UpgradeArt;
    }, function (module) {
      Paper = module.Paper;
      Label = module.Label;
      Button = module.Button;
    }, function (module) {
      goods = module.goods;
    }, function (module) {
      L = module.L;
    }, function (module) {
      Number = module.Number;
      FromRun = module.FromRun;
    }, function (module) {
      playCue = module.playCue;
    }, function (module) {
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports('Open', Open);
      cclegacy._RF.push({}, "2a062r8WIpNlq2KPvst8E2d", "resultDetails", undefined);
      var K = colors;
      function place(widget, x, y, w, h) {
        widget.SetStyle({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h
        });
        return widget;
      }
      // A stack of rows placed top to bottom in a panel of the given width.
      var Stack = /*#__PURE__*/function () {
        function Stack(width, top) {
          if (top === void 0) {
            top = 0;
          }
          this.panel = void 0;
          this.y = 0;
          this.width = width;
          this.panel = UI.Panel({
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: 0,
            overflow: 'visible',
            pointerEvents: 'none'
          });
          this.y = top;
        }
        var _proto = Stack.prototype;
        _proto.add = function add(w, h, marginTop, marginBottom) {
          if (marginTop === void 0) {
            marginTop = 0;
          }
          if (marginBottom === void 0) {
            marginBottom = 0;
          }
          this.y += marginTop;
          w.SetStyle({
            position: 'absolute',
            top: this.y
          });
          this.panel.AddChild(w);
          this.y += h + marginBottom;
        };
        _proto.finish = function finish(bottom) {
          if (bottom === void 0) {
            bottom = 0;
          }
          this.panel.SetStyle({
            height: this.y + bottom
          });
          return this.panel;
        };
        return Stack;
      }();
      function Open(app, restoring) {
        var _app$resultTab, _app$resultScroll;
        if (restoring === void 0) {
          restoring = false;
        }
        if (app.refs.detailOverlay) return;
        var g = app.g;
        var run = g.run;
        app.resultDetails = true;
        app.resultTab = (_app$resultTab = app.resultTab) != null ? _app$resultTab : 1;
        app.resultScroll = (_app$resultScroll = app.resultScroll) != null ? _app$resultScroll : [0, 0, 0];
        var page = app.page;
        var w = 360,
          h = 640;
        var u = Math.max(1, w / 430);
        var y = h / u > 600 ? h * .05 : 8 * u;
        var pw = w - 20 * u,
          ph = h - 2 * y;
        // Added last, the overlay is on top; it takes every touch while open.
        var overlay = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: h,
          backgroundColor: [0, 0, 0, 85],
          onClick: function onClick() {}
        });
        var book = UI.Panel({
          position: 'absolute',
          left: 10 * u,
          top: y,
          width: pw,
          height: ph
        });
        book.AddChild(place(Paper('ui.result.paper', pw, ph), 0, 0, pw, ph));
        overlay.AddChild(book);
        page.AddChild(overlay);
        app.refs.detailOverlay = overlay;
        var closing = false;
        // The closing overlay must never keep swallowing input: it is removed after the fade even without onComplete.
        var remove = function remove() {
          overlay.Destroy();
          if (app.refs.detailOverlay === overlay) app.refs.detailOverlay = undefined;
          if (app.detailClosing && app.detailClosing.overlay === overlay) app.detailClosing = undefined;
        };
        var close = function close() {
          if (closing) return;
          closing = true;
          app.resultDetails = false;
          overlay.DisableInput();
          book.DisableInput();
          app.detailClosing = {
            overlay: overlay,
            removeAt: app.clock + .3,
            remove: remove
          };
          overlay.Animate({
            keyframes: {
              0: {
                opacity: 1
              },
              1: {
                opacity: 0
              }
            },
            duration: .18,
            fillMode: 'both',
            onComplete: remove
          });
        };
        var titleWidth = 188 * u;
        book.AddChild(place(Paper('ui.result.button.secondary', titleWidth, 46 * u), (pw - titleWidth) / 2, -7 * u, titleWidth, 46 * u));
        // Title centred on the plate's face (its lower sixth is shadow).
        book.AddChild(Label(L('本局明细'), 21 * u, 46 * u, -7 * u + 46 * u * .138, pw - 92 * u, 46 * u * (1 - .138 - .162), true));
        // The x sits inside the paper's frame; the hit area stays 44.
        var closeButton = UI.Button({
          position: 'absolute',
          left: pw - 12 * u - 44 * u,
          top: 20 * u,
          width: 44 * u,
          height: 44 * u,
          onClick: function onClick() {
            playCue('sfx.click');
            close();
          }
        });
        closeButton.AddChild(Label('×', 26 * u, 0, 0, 44 * u, 44 * u, true));
        book.AddChild(closeButton);
        app.refs.detailClose = closeButton;
        book.AddChild(Label(L('本局总分 {0}', Number(run.score)), 17 * u, 20 * u, 43 * u, pw - 40 * u, 38 * u, true));
        var tw = (pw - 24 * u) / 3;
        var viewportY = 141 * u,
          viewportH = ph - 214 * u;
        // Content keeps 6 inside the paper's frame; each page has 22 units of right padding (the scrollbar side).
        var cw = pw - 48 * u,
          inner = cw - 22 * u;
        var data = FromRun(run);
        // D.Label(value, size*u) with left alignment and 1.35 line height: one line is 1.35 * size * u tall.
        var copy = function copy(value, size, bold, color) {
          var label = Label$1(value, size * u, color);
          label.SetStyle({
            textAlign: 'left',
            whiteSpace: 'normal',
            fontFamily: bold ? 'sans' : 'body',
            lineHeight: 1.35,
            verticalAlign: 'top'
          });
          return label;
        };
        // A label with no height of its own: Yoga measures one line as 1.35 x the font size, and the auto-fit never
        // shrinks it (autoHeight).
        var lineH = function lineH(size) {
          return 1.35 * size * u;
        };
        // Notes are wrapped with measured metrics and get the exact height of their lines.
        var note = function note(stack, value, align) {
          if (align === void 0) {
            align = 'left';
          }
          var size = 14 * .75 * u,
            width = cw - (align === 'center' ? 22 : 14) * u;
          var _S$Block = Block(value, size, 0, 0, width, K.muted, 'body', align, 1.35),
            block = _S$Block[0],
            bh = _S$Block[1];
          stack.add(block, bh, 12 * u, 12 * u);
        };
        var divider = function divider(stack) {
          return stack.add(UI.Panel({
            left: 0,
            width: inner,
            height: u,
            backgroundColor: [215, 188, 150, 255],
            pointerEvents: 'none'
          }), u);
        };
        // Right-aligned amount; its column is reserved before the name takes the rest of the row.
        var amount = function amount(value, size, color) {
          // Measured at UI.Theme.FontSize(size): `size` points, 4/3 of the drawn size, so the column has slack.
          var measured = textWidth(value, size * u, 'sans');
          var width = Math.min(cw * .46, measured + 2 * u);
          var label = copy(value, size * Math.min(1, width / Math.max(1, measured)), true, color);
          label.SetStyle({
            width: width,
            height: 30 * u,
            whiteSpace: 'nowrap',
            textAlign: 'right',
            verticalAlign: 'middle'
          });
          return [label, width];
        };
        // A row panel of height rh whose children are centred vertically, laid out left to right.
        var row = function row(rh, items, gap, padX) {
          if (padX === void 0) {
            padX = 0;
          }
          var panel = UI.Panel({
            left: 0,
            width: inner,
            height: rh,
            pointerEvents: 'none',
            overflow: 'visible'
          });
          var x = padX;
          for (var _iterator = _createForOfIteratorHelperLoose(items), _step; !(_step = _iterator()).done;) {
            var _step$value = _step.value,
              wgt = _step$value[0],
              iw = _step$value[1],
              ih = _step$value[2];
            wgt.SetStyle({
              position: 'absolute',
              left: x,
              top: (rh - ih) / 2,
              width: iw
            });
            panel.AddChild(wgt);
            x += iw + gap;
          }
          return panel;
        };
        var sourceRow = function sourceRow(stack, r) {
          var icon = r.upgrade ? UpgradeArt(r.upgrade, 34 * u, goods) : Art(r.icon, 34 * u, 34 * u);
          var valueSize = (r.numeric ? 17 : 14) * u;
          var valueWidth = textWidth(r.value, valueSize, r.numeric ? 'sans' : 'body');
          var rightWidth = Math.min(cw * .42, valueWidth + 2 * u);
          var descW = cw - 34 * u - 20 * u - rightWidth - 22 * u; // icon, gaps, value column, right padding
          var title = copy(r.name, 17, true);
          title.SetStyle({
            whiteSpace: 'nowrap',
            height: lineH(17),
            autoHeight: true
          });
          var _S$Block2 = Block(r.note, 13 * .75 * u, 0, 0, descW, K.muted, 'body', 'left', 1.35),
            description = _S$Block2[0],
            dh = _S$Block2[1];
          var leftH = lineH(17) + 4 * u + dh;
          var left = UI.Panel({
            width: descW,
            height: leftH,
            pointerEvents: 'none',
            overflow: 'visible'
          });
          title.SetStyle({
            position: 'absolute',
            left: 0,
            top: 0,
            width: descW
          });
          left.AddChild(title);
          description.SetStyle({
            top: lineH(17) + 4 * u
          });
          left.AddChild(description);
          var value = copy(r.value, valueSize / u * Math.min(1, rightWidth / Math.max(1, valueWidth)), r.numeric, r.numeric ? [134, 85, 20, 255] : K.muted);
          value.SetStyle({
            height: 30 * u,
            whiteSpace: 'nowrap',
            textAlign: 'right',
            verticalAlign: 'middle'
          });
          // The right-hand result is centred against the whole name/description group.
          var rh = Math.max(68 * u, 20 * u + Math.max(34 * u, leftH, 30 * u));
          icon.SetStyle({
            height: 34 * u
          });
          left.SetStyle({
            height: leftH
          });
          stack.add(row(rh, [[icon, 34 * u, 34 * u], [left, descW, leftH], [value, rightWidth, 30 * u]], 10 * u), rh);
        };
        var score = new Stack(inner, 4 * u);
        for (var _iterator2 = _createForOfIteratorHelperLoose(data.scores), _step2; !(_step2 = _iterator2()).done;) {
          var r = _step2.value;
          var name = copy(r.name, 17, true);
          name.SetStyle({
            height: 30 * u,
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
          });
          var _amount2 = amount(r.value, 22),
            _value = _amount2[0],
            _vw = _amount2[1];
          var nameW = inner - 32 * u - 10 * u * 2 - _vw;
          score.add(row(61 * u, [[Art(r.icon, 32 * u, 32 * u), 32 * u, 32 * u], [name, nameW, 30 * u], [_value, _vw, 30 * u]], 10 * u), 61 * u);
          divider(score);
        }
        {
          var sum = copy(L('合计'), 18, true);
          sum.SetStyle({
            height: 30 * u,
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
          });
          var _amount = amount(Number(data.score), 22),
            value = _amount[0],
            vw = _amount[1];
          score.add(row(58 * u, [[sum, inner - vw, 30 * u], [value, vw, 30 * u]], 0), 58 * u);
        }
        note(score, L('连消与偏好倍率已计入上述来源，不重复加分。'));
        var record = copy(L('本局战绩'), 16, true);
        record.SetStyle({
          width: inner,
          height: lineH(16),
          autoHeight: true
        });
        score.add(record, lineH(16));
        note(score, L('最大连消 {0}\n最高连消分 {1}\n单次交换的最佳表现，不额外计分', run.metrics.maxCascade, Number(run.metrics.maxChainScore)));
        var scoreContent = score.finish(20 * u);
        var source = new Stack(inner);
        var group = function group(title, rows, empty) {
          var heading = copy(L(title), 16, false);
          heading.SetStyle({
            width: inner,
            height: 34 * u,
            verticalAlign: 'middle'
          });
          source.add(heading, 34 * u);
          if (rows.length === 0 && empty) note(source, L(empty));
          for (var _iterator3 = _createForOfIteratorHelperLoose(rows), _step3; !(_step3 = _iterator3()).done;) {
            var r = _step3.value;
            sourceRow(source, r);
            divider(source);
          }
        };
        group('携带的道具', data.items, '这次还没收到道具谢礼');
        group('一起营业的猫', data.cats, '本局没有上场伙伴');
        if (data.replaced.length > 0) group('已替换的道具', data.replaced);
        var sourceContent = source.finish(16 * u);
        var time = new Stack(inner);
        var hourglass = Art('upgrade.general_hourglass', 48 * u, 56 * u);
        hourglass.SetStyle({
          left: (inner - 48 * u) / 2
        });
        time.add(hourglass, 56 * u);
        var timeTitle = copy(L('本局获得加时'), 20, true);
        timeTitle.SetStyle({
          width: inner,
          height: lineH(20),
          textAlign: 'center',
          autoHeight: true
        });
        time.add(timeTitle, lineH(20), 10 * u);
        var seconds = copy(L('{0} 秒', (data.timeTenths / 10).toFixed(1)), 38, true, data.timeTenths > 0 ? K.mint : K.muted);
        seconds.SetStyle({
          width: inner,
          height: lineH(38),
          textAlign: 'center',
          whiteSpace: 'nowrap',
          autoHeight: true
        });
        time.add(seconds, lineH(38), 12 * u, 16 * u);
        for (var _iterator4 = _createForOfIteratorHelperLoose(data.time), _step4; !(_step4 = _iterator4()).done;) {
          var _r = _step4.value;
          // Same 30-tall centred box as the value, so the source name and "+0.3 秒" share a baseline.
          var title = copy(_r.name, 17, true);
          title.SetStyle({
            height: 30 * u,
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
          });
          var _amount3 = amount(_r.value, 19, K.mint),
            _value2 = _amount3[0],
            _vw2 = _amount3[1];
          time.add(row(65 * u, [[title, inner - 16 * u - _vw2, 30 * u], [_value2, _vw2, 30 * u]], 0, 8 * u), 65 * u);
          divider(time);
        }
        var ZW = '​';
        note(time, data.time.length > 0 ? L('加时已计入本局营业；' + ZW + '\n临近打烊会' + ZW + '逐步减少。\n累计加时' + ZW + '不等于单局时长。') : L('本局没有获得额外加时'), data.time.length === 0 ? 'center' : 'left');
        var timeContent = time.finish(20 * u);
        var contents = [scoreContent, sourceContent, timeContent];
        var views = [],
          highlights = [],
          tabs = [],
          edges = [];
        var updateEdges = function updateEdges(index, view, offset) {
          var range = view.MaxScroll();
          var active = app.resultTab === index + 1 && range > 0;
          edges[index].top.SetStyle({
            visible: active && offset > 0
          });
          edges[index].bottom.SetStyle({
            visible: active && offset < range
          });
        };
        // Paper-coloured fade ending in a 3-unit opaque seal at the viewport edge (1-unit bands).
        var fade = function fade(height, top, isTop) {
          var layer = UI.Panel({
            position: 'absolute',
            left: 24 * u,
            top: top,
            width: cw - 22 * u,
            height: height,
            pointerEvents: 'none'
          });
          var seal = 3 * u,
            gh = Math.max(1, Math.round(height - seal));
          layer.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: isTop ? 0 : height - seal,
            width: '100%',
            height: seal,
            backgroundColor: [254, 245, 223, 255],
            pointerEvents: 'none'
          }));
          for (var n = 1; n <= gh; n++) {
            var remaining = gh - n + 1;
            layer.AddChild(UI.Panel({
              position: 'absolute',
              left: 0,
              top: isTop ? seal : n - 1,
              width: '100%',
              height: remaining * (height - seal) / gh,
              backgroundColor: [254, 245, 223, Math.floor(255 / remaining + .5)],
              pointerEvents: 'none'
            }));
          }
          return layer;
        };
        var maxLine = Math.max(lineH(38), lineH(17));
        var switchTab = function switchTab(index) {
          app.resultTab = index;
          for (var i = 0; i < 3; i++) {
            views[i].SetStyle({
              visible: i === index - 1
            });
            highlights[i].SetStyle({
              visible: i === index - 1
            });
          }
          views[index - 1].UpdateContentSize();
          views[index - 1].SetScrollY(app.resultScroll[index - 1], true);
          for (var _i = 0; _i < 3; _i++) updateEdges(_i, views[_i], views[_i].offset);
        };
        ['得分构成', '道具与猫', '加时记录'].forEach(function (title, i) {
          var tab = Button(L(title), function () {
            return switchTab(i + 1);
          }, tw - 3 * u, 44 * u, true, false, 15 * u);
          var highlight = place(Paper('ui.result.button.primary', tw - 3 * u, 44 * u), 0, 0, tw - 3 * u, 44 * u);
          tab.InsertChild(highlight, 1);
          highlights.push(highlight);
          tab.AddChild(place(Art('ui.result.clip', 8 * u, 14 * u), tw / 2 - 4 * u, -5 * u, 8 * u, 14 * u));
          book.AddChild(place(tab, 12 * u + i * tw, 90 * u, tw - 3 * u, 44 * u));
          tabs.push(tab);
          var view = UI.ScrollView({
            position: 'absolute',
            left: 24 * u,
            top: viewportY,
            width: cw,
            height: viewportH,
            showScrollbar: true,
            children: [contents[i]],
            onScroll: function onScroll(v, _x, offset) {
              app.resultScroll[i] = offset;
              updateEdges(i, v, offset);
            }
          });
          book.AddChild(view);
          views.push(view);
          var minFade = maxLine * .6;
          var topFade = Math.max(12 * u, minFade),
            bottomFade = Math.max(18 * u, minFade);
          edges.push({
            top: fade(topFade, viewportY, true),
            bottom: fade(bottomFade, viewportY + viewportH - bottomFade, false)
          });
          book.AddChild(edges[i].top);
          book.AddChild(edges[i].bottom);
        });
        var footer = Button(L('收起明细'), close, w * .56, 48 * u, false, false, 20 * u);
        book.AddChild(place(footer, (pw - w * .56) / 2, ph - 65 * u, w * .56, 48 * u));
        app.refs.detailTabs = tabs;
        app.refs.detailViews = views;
        app.refs.detailFades = edges;
        app.refs.detailFooter = footer;
        app.refs.detailBook = book;
        views.forEach(function (view, i) {
          view.UpdateContentSize();
          view.SetScrollY(app.resultScroll[i], true);
        });
        switchTab(app.resultTab);
        if (!restoring) book.Animate({
          keyframes: {
            0: {
              opacity: 0,
              translateY: 14 * u
            },
            1: {
              opacity: 1,
              translateY: 0
            }
          },
          duration: .28,
          easing: 'easeOut',
          fillMode: 'both'
        });
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/resumeCountdown.ts", ['cc', './kit.ts', './skin.ts', './i18n.ts', './audio.ts'], function (exports) {
  var cclegacy, UI, Image, Text, ink, FaceText, L, playCue;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Text = module.Text;
      ink = module.ink;
      FaceText = module.FaceText;
    }, function (module) {
      L = module.L;
    }, function (module) {
      playCue = module.playCue;
    }],
    execute: function () {
      exports({
        Start: Start,
        Update: Update
      });
      cclegacy._RF.push({}, "e4657vAueZPEZTHiQevepuB", "resumeCountdown", undefined);
      var SECONDS = 3;
      var TAG = {
        x: 96,
        y: 296,
        w: 168,
        h: 168
      };
      var PAD = {
        x: 178.5,
        y: 404
      }; // main pad paper centre (measured)
      var RIBBON = {
        w: 132,
        y: 452
      };
      var SPARKLES = [[80, 376, 24], [254, 366, 26], [104, 310, 22]];
      function pop(widget, from, duration) {
        widget.Animate({
          keyframes: {
            0: {
              scale: from,
              opacity: 0
            },
            .45: {
              scale: 1.08,
              opacity: 1
            },
            1: {
              scale: 1,
              opacity: 1
            }
          },
          duration: duration,
          fillMode: 'both',
          easing: 'easeOut'
        });
      }
      function build(app) {
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          pointerEvents: 'none'
        });
        var dim = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundColor: [47, 32, 20, 115],
          pointerEvents: 'none'
        });
        root.AddChild(dim);
        var glow = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          pointerEvents: 'none'
        });
        for (var _i = 0, _arr = [[220, 40], [180, 60], [150, 80]]; _i < _arr.length; _i++) {
          var _arr$_i = _arr[_i],
            d = _arr$_i[0],
            a = _arr$_i[1];
          glow.AddChild(UI.Panel({
            position: 'absolute',
            left: 180 - d / 2,
            top: 386 - d / 2,
            width: d,
            height: d,
            borderRadius: d / 2,
            backgroundColor: [255, 222, 132, a],
            pointerEvents: 'none'
          }));
        }
        root.AddChild(glow);
        var tag = Image('ui.resume.paw_tag', TAG.x, TAG.y, TAG.w, TAG.h);
        root.AddChild(tag);
        var number = Text('3', 51, PAD.x - 60, PAD.y - 48, 120, 96, ink, 'center', 'sans');
        root.AddChild(number);
        var rh = RIBBON.w * 116 / 336,
          rx = 180 - RIBBON.w / 2;
        var ribbon = Image('ui.resume.ribbon', rx, RIBBON.y, RIBBON.w, rh);
        root.AddChild(ribbon);
        var ribbonText = FaceText('ui.resume.ribbon', rx, RIBBON.y, RIBBON.w, rh, L('准备营业'), 10.5, ink, 'center', 'sans', 6);
        root.AddChild(ribbonText);
        var sparkles = SPARKLES.map(function (s) {
          var w = Image('ui.resume.sparkle', s[0], s[1], s[2], s[2]);
          root.AddChild(w);
          return w;
        });
        app.page.AddChild(root);
        // No fade-in: coming from the pause page its mask was already on.
        pop(tag, .6, .25);
        pop(ribbon, .6, .25);
        return {
          root: root,
          dim: dim,
          glow: glow,
          tag: tag,
          number: number,
          ribbonText: ribbonText,
          sparkles: sparkles,
          elapsed: 0,
          beat: 0,
          finished: false
        };
      }

      // Starts play again after pause with the countdown.
      function Start(app) {
        var _g$play;
        var g = app.g;
        g.resumeDelay = SECONDS;
        app.Game();
        g.countdown = build(app);
        // Game() drew the HUD before the countdown existed; redraw it without the "准备继续" line.
        (_g$play = g.play) == null || _g$play.feedback.SetText(g.lastChainFeedback);
        app.RefreshHUD();
        console.log('[ResumeCountdown] start');
      }
      function Update(app, dt) {
        var g = app.g;
        var cd = g.countdown;
        if (!cd) return;
        if (!cd.root.parent) {
          g.countdown = undefined;
          return;
        } // page rebuilt or left the run
        cd.elapsed += dt;
        var beat = Math.min(SECONDS, Math.floor(cd.elapsed) + 1);
        if (cd.elapsed < SECONDS && beat !== cd.beat) {
          cd.beat = beat;
          cd.number.SetText(String(SECONDS - beat + 1));
          cd.number.Animate({
            keyframes: {
              0: {
                scale: 1.35,
                opacity: .6
              },
              1: {
                scale: 1,
                opacity: 1
              }
            },
            duration: .2,
            fillMode: 'both',
            easing: 'easeOut'
          });
          cd.glow.Animate({
            keyframes: {
              0: {
                scale: 1,
                opacity: 1
              },
              .5: {
                scale: 1.05,
                opacity: 1
              },
              1: {
                scale: 1,
                opacity: 1
              }
            },
            duration: .6,
            fillMode: 'both'
          });
          cd.sparkles.forEach(function (s, i) {
            return s.Animate({
              keyframes: {
                0: {
                  scale: .6,
                  opacity: .5
                },
                .4: {
                  scale: 1.2,
                  opacity: 1
                },
                1: {
                  scale: 1,
                  opacity: 1
                }
              },
              duration: .22 + .08 * (i + 1),
              fillMode: 'both'
            });
          });
          playCue('sfx.select');
        } else if (cd.elapsed >= SECONDS && !cd.finished) {
          cd.finished = true;
          cd.number.SetText(L('开张！'));
          cd.ribbonText.SetText(L('欢迎光临')); // the ribbon no longer says 准备营业 under 开张！
          cd.number.SetStyle({
            fontSize: 20
          }); // three characters stay inside the main pad's paper face
          cd.number.Animate({
            keyframes: {
              0: {
                scale: 1.3,
                opacity: .6
              },
              1: {
                scale: 1,
                opacity: 1
              }
            },
            duration: .2,
            fillMode: 'both',
            easing: 'easeOut'
          });
        } else if (cd.finished && cd.elapsed >= SECONDS + .35 && !cd.fading) {
          cd.fading = true;
          cd.root.Animate({
            keyframes: {
              0: {
                opacity: 1
              },
              1: {
                opacity: 0
              }
            },
            duration: .25,
            fillMode: 'both'
          });
        } else if (cd.fading && cd.elapsed >= SECONDS + .6) {
          cd.root.Destroy();
          g.countdown = undefined;
          console.log('[ResumeCountdown] done');
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/run.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './config.ts', './board.ts', './buildRules.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, cats, RECOVERY_FADE_END, RECOVERY_FADE_START, MAX_TIME, SESSION_LIMIT, ORDER_TIME, UpgradeSlotCap, UPGRADE_FIRST_ORDERS, SWAP_DURATION, CatLevel, ITEM_TUNING, SCORE_PER_GOOD, CAT_SCORE_MULT, CLEAR_DURATION, FALL_DURATION, Cat, ReleasePool, REROLL_AD_AMOUNT, SIZE, INITIAL_TIME, RULE_VERSION, REROLL_MAX_LEVEL, REROLL_MAX, REROLL_BASE, ORDER_BASE, ORDER_GROWTH, ORDER_ACCELERATION, CUDDLE_ALONE_SECONDS, FindMove, Inside, RainbowTapKind, ValidSwap, Copy, Swap, Matches, EnsureMove, Fall, New, BasePool, OnOrder, Count, OnMatches, OnSpecial, Bonus, Collected, Pool, Convert, Place, RefillKind, AfterRefill;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      cats = module.cats;
      RECOVERY_FADE_END = module.RECOVERY_FADE_END;
      RECOVERY_FADE_START = module.RECOVERY_FADE_START;
      MAX_TIME = module.MAX_TIME;
      SESSION_LIMIT = module.SESSION_LIMIT;
      ORDER_TIME = module.ORDER_TIME;
      UpgradeSlotCap = module.UpgradeSlotCap;
      UPGRADE_FIRST_ORDERS = module.UPGRADE_FIRST_ORDERS;
      SWAP_DURATION = module.SWAP_DURATION;
      CatLevel = module.CatLevel;
      ITEM_TUNING = module.ITEM_TUNING;
      SCORE_PER_GOOD = module.SCORE_PER_GOOD;
      CAT_SCORE_MULT = module.CAT_SCORE_MULT;
      CLEAR_DURATION = module.CLEAR_DURATION;
      FALL_DURATION = module.FALL_DURATION;
      Cat = module.Cat;
      ReleasePool = module.ReleasePool;
      REROLL_AD_AMOUNT = module.REROLL_AD_AMOUNT;
      SIZE = module.SIZE;
      INITIAL_TIME = module.INITIAL_TIME;
      RULE_VERSION = module.RULE_VERSION;
      REROLL_MAX_LEVEL = module.REROLL_MAX_LEVEL;
      REROLL_MAX = module.REROLL_MAX;
      REROLL_BASE = module.REROLL_BASE;
      ORDER_BASE = module.ORDER_BASE;
      ORDER_GROWTH = module.ORDER_GROWTH;
      ORDER_ACCELERATION = module.ORDER_ACCELERATION;
      CUDDLE_ALONE_SECONDS = module.CUDDLE_ALONE_SECONDS;
    }, function (module) {
      FindMove = module.FindMove;
      Inside = module.Inside;
      RainbowTapKind = module.RainbowTapKind;
      ValidSwap = module.ValidSwap;
      Copy = module.Copy;
      Swap = module.Swap;
      Matches = module.Matches;
      EnsureMove = module.EnsureMove;
      Fall = module.Fall;
      New = module.New;
    }, function (module) {
      BasePool = module.BasePool;
      OnOrder = module.OnOrder;
      Count = module.Count;
      OnMatches = module.OnMatches;
      OnSpecial = module.OnSpecial;
      Bonus = module.Bonus;
      Collected = module.Collected;
      Pool = module.Pool;
      Convert = module.Convert;
      Place = module.Place;
      RefillKind = module.RefillKind;
      AfterRefill = module.AfterRefill;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a7f158rb01CNr2BkJIIuX7c", "run", undefined);
      var N = SIZE;
      function key(r, c) {
        return (r - 1) * N + c;
      }
      var Run = exports('Run', /*#__PURE__*/function () {
        function Run(seed, equipped, levels) {
          var _this = this;
          this.seed = 1;
          this.randomState = 1;
          this.rerollState = 1;
          this.nextUid = 0;
          this.id = 0;
          // the profile run id (set by the app when the run starts; Maker App.NewGame run.id)
          this.score = 0;
          this.time = INITIAL_TIME;
          this.orderIndex = 1;
          this.orderProgress = 0;
          this.completedOrders = 0;
          this.phase = 'idle';
          this.phaseRemaining = 0;
          this.events = [];
          this.actions = [];
          this.elapsed = 0;
          this.idleElapsed = 0;
          this.timeUp = false;
          this.ownedUpgrades = {};
          this.pendingUpgrades = 0;
          this.choices = [];
          this.cats = [];
          this.orderFlags = {};
          this.exchange = {};
          this.clearSet = new Map();
          this.creations = {};
          this.petQueue = [];
          this.ruleVersion = RULE_VERSION;
          this.upgradeOrder = [];
          this.replacementOffers = 0;
          this.replacing = false;
          this.featureKind = 1;
          this.relay = {
            ribbon: 0,
            bake: 0
          };
          this.refillTools = [];
          this.windowCharge = 0;
          this.foamCharge = 0;
          this.spoolCharge = 0;
          this.rushCharge = 0;
          this.timerCharge = 0;
          this.measureCharge = 0;
          this.sampleQueued = 0;
          this.counterPending = {};
          this.featureRefill = 0;
          this.bowCount = 0;
          this.metrics = {
            maxCascade: 0,
            maxChainScore: 0,
            contributions: {
              base: 0,
              item: 0,
              pet: 0,
              combo: 0
            },
            sources: {},
            generated: {},
            converted: {},
            time: {},
            catUses: {}
          };
          this.rerollBudget = 0;
          this.rerollRemaining = 0;
          this.rerollAdUsed = false;
          this.refillOrigin = undefined;
          this.stampFrom = undefined;
          this.lastRoute = undefined;
          this.board = void 0;
          this.seed = Math.floor(Number(seed) || 1) % 2147483647;
          if (this.seed === 0) this.seed = 1;
          this.randomState = this.seed;
          // Independent reroll stream: rerolling never touches the board RNG. Lua computes (seed*2654435761+12345) % m in
          // 64-bit integers; seed*2654435761 exceeds 2^53, so split the multiplier (40503*65536 + 31153) and reduce mod m
          // first - every intermediate stays below 2^53 and the result is exact.
          this.rerollState = (this.seed * 40503 % 2147483647 * 65536 + this.seed * 31153 + 12345) % 2147483647;
          if (this.rerollState === 0) this.rerollState = 1;
          this.featureKind = this.seed % 5 + 1;
          var seen = {};
          for (var _iterator = _createForOfIteratorHelperLoose(equipped != null ? equipped : ['tuantuan']), _step; !(_step = _iterator()).done;) {
            var id = _step.value;
            if (this.cats.length < 2 && Cat(id) && !seen[id]) {
              var _id;
              this.cats.push({
                id: id,
                charge: 0,
                uses: 0,
                level: Math.max(1, Math.min(5, Math.floor((_id = (levels != null ? levels : {})[id]) != null ? _id : 1)))
              });
              seen[id] = true;
            }
          }
          // Free-reroll budget is snapshotted at run start from the starting cats.
          var rerollBonus = 0;
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.cats), _step2; !(_step2 = _iterator2()).done;) {
            var cat = _step2.value;
            if (cat.level === REROLL_MAX_LEVEL) rerollBonus++;
          }
          this.rerollBudget = Math.min(REROLL_MAX, REROLL_BASE + rerollBonus);
          this.rerollRemaining = this.rerollBudget;
          this.board = New(function (n) {
            return _this.Random(n);
          }, function (k) {
            return _this.NewCell(k);
          });
        }
        var _proto = Run.prototype;
        _proto.Random = function Random(n) {
          this.randomState = this.randomState * 48271 % 2147483647;
          return this.randomState % n + 1;
        };
        _proto.RerollRandom = function RerollRandom(n) {
          this.rerollState = this.rerollState * 48271 % 2147483647;
          return this.rerollState % n + 1;
        };
        _proto.NewCell = function NewCell(kind, special, credited) {
          this.nextUid++;
          return {
            kind: kind,
            special: special,
            uid: this.nextUid,
            credited: credited != null ? credited : false
          };
        };
        _proto.Emit = function Emit(event) {
          this.events.push(event);
        };
        _proto.DrainEvents = function DrainEvents() {
          var events = this.events;
          this.events = [];
          return events;
        };
        _proto.GetOrder = function GetOrder(index) {
          var i = index != null ? index : this.orderIndex;
          var pool = BasePool(this);
          var a = pool[(this.seed + i * 3) % pool.length];
          var others = pool.filter(function (v) {
            return v !== a;
          });
          var b = others[(i - 1) % others.length];
          var target = ORDER_BASE + ORDER_GROWTH * (i - 1) + ORDER_ACCELERATION * Math.pow(i - 1, 2);
          if (this.stampFrom !== undefined && i >= this.stampFrom) target = Math.floor(target * (1 - ITEM_TUNING.stamp));
          return {
            index: i,
            target: target,
            preferences: [a, b],
            catId: cats[(i - 1) % cats.length].id
          };
        };
        _proto.Snapshot = function Snapshot() {
          var order = this.GetOrder();
          return {
            index: this.orderIndex,
            target: order.target,
            preferences: this.exchange.player ? this.exchange.preferences : order.preferences,
            progress: this.orderProgress,
            score: this.score
          };
        }
        // The two 偏好品 shown on the order paper (locked for the exchange in progress).
        ;

        _proto.Preferences = function Preferences() {
          var _this$exchange$prefer;
          return (_this$exchange$prefer = this.exchange.preferences) != null ? _this$exchange$prefer : this.GetOrder().preferences;
        };
        _proto.IsPreferred = function IsPreferred(kind) {
          var p = this.Preferences();
          return kind === p[0] || kind === p[1];
        };
        _proto.RecoveryFactor = function RecoveryFactor() {
          return Math.max(0, Math.min(1, (RECOVERY_FADE_END - this.elapsed) / (RECOVERY_FADE_END - RECOVERY_FADE_START)));
        };
        _proto.AddTime = function AddTime(amountIn, sourceIn) {
          if (this.timeUp) return 0;
          var amount = amountIn;
          if (this.ownedUpgrades.general_hourglass) amount = amount * (1 + ITEM_TUNING.hourglass);
          var actual = Math.max(0, Math.min(MAX_TIME - this.time, SESSION_LIMIT - this.elapsed - this.time, amount * this.RecoveryFactor()));
          this.time = this.time + actual;
          var source = sourceIn != null ? sourceIn : '消除';
          if (actual > 0) {
            var _this$metrics$time$so;
            this.metrics.time[source] = ((_this$metrics$time$so = this.metrics.time[source]) != null ? _this$metrics$time$so : 0) + actual;
            this.Emit({
              type: 'time',
              amount: actual,
              source: source
            });
          }
          return actual;
        };
        _proto.Credit = function Credit(amount, sourceIn) {
          var _exec$, _exec, _this$metrics$sources;
          if (amount <= 0) return;
          var source = sourceIn != null ? sourceIn : 'base';
          var bucket = (_exec$ = (_exec = /^([A-Za-z0-9]+):/.exec(source)) == null ? void 0 : _exec[1]) != null ? _exec$ : 'base';
          this.score = this.score + amount;
          this.metrics.contributions[bucket] = this.metrics.contributions[bucket] + amount;
          this.metrics.sources[source] = ((_this$metrics$sources = this.metrics.sources[source]) != null ? _this$metrics$sources : 0) + amount;
        };
        _proto.AddScore = function AddScore(amount, source) {
          this.Credit(amount, source);
          this.orderProgress = this.orderProgress + amount;
          // The ledger pays for every order completed by the original amount; its own bonus cannot chain into itself.
          var ledgerAdded = 0;
          while (this.orderProgress >= this.GetOrder().target) {
            var order = this.GetOrder();
            this.orderProgress = this.orderProgress - order.target;
            var index = this.orderIndex;
            this.orderIndex = index + 1;
            this.completedOrders = this.completedOrders + 1;
            this.orderFlags = {};
            var timeBonus = this.AddTime(ORDER_TIME, '交单');
            if (this.CanGrantUpgrade(index)) this.pendingUpgrades = this.pendingUpgrades + 1;
            this.Emit({
              type: 'order',
              index: index,
              target: order.target,
              timeBonus: timeBonus,
              preferences: order.preferences
            });
            OnOrder(this);
            if (this.ownedUpgrades.general_ledger && this.orderProgress - ledgerAdded >= 0) {
              var ledger = ITEM_TUNING.ledger;
              this.Credit(ledger, 'item:general_ledger');
              this.orderProgress = this.orderProgress + ledger;
              ledgerAdded = ledgerAdded + ledger;
            }
          }
        };
        _proto.UpgradeSlotsUsed = function UpgradeSlotsUsed() {
          return Count(this) + this.pendingUpgrades;
        };
        _proto.CanGrantUpgrade = function CanGrantUpgrade(index) {
          if (this.UpgradeSlotsUsed() >= UpgradeSlotCap()) return false;
          return UPGRADE_FIRST_ORDERS.includes(index);
        };
        _proto.CountUpgrades = function CountUpgrades(route) {
          return Count(this, route);
        };
        _proto.RecordChain = function RecordChain() {
          if (this.exchange.player && !this.exchange.recorded) {
            var _this$exchange$cascad, _this$exchange$startS;
            this.metrics.maxCascade = Math.max(this.metrics.maxCascade, (_this$exchange$cascad = this.exchange.cascade) != null ? _this$exchange$cascad : 0);
            this.metrics.maxChainScore = Math.max(this.metrics.maxChainScore, this.score - ((_this$exchange$startS = this.exchange.startScore) != null ? _this$exchange$startS : this.score));
            this.exchange.recorded = true;
          }
        };
        _proto.FindMove = function FindMove$1() {
          return FindMove(this.board);
        };
        _proto.TapRainbow = function TapRainbow(r, c) {
          if (this.phase !== 'idle' || this.time <= 0 || !Inside(r, c)) return false;
          var cell = this.board[r][c];
          if (!cell || cell.special !== 'rainbow') return false;
          var preferences = this.GetOrder().preferences;
          var kind = RainbowTapKind(this.board, preferences);
          this.actions.push({
            type: 'rainbow_tap',
            at: this.elapsed,
            idleElapsed: this.idleElapsed,
            r: r,
            c: c
          });
          this.exchange = {
            preferences: preferences,
            cascade: 1,
            timeAdded: 0,
            collected: 0,
            player: true,
            rainbowKind: kind,
            startScore: this.score
          };
          var set = new Map();
          this.Mark(set, r, c);
          this.Clear(set, {});
          return true;
        };
        _proto.Swap = function Swap$1(r, c, rr, cc) {
          if (this.phase !== 'idle' || this.time <= 0) return false;
          if (!ValidSwap(this.board, r, c, rr, cc)) {
            this.Emit({
              type: 'invalid',
              from: {
                r: r,
                c: c
              },
              to: {
                r: rr,
                c: cc
              }
            });
            return false;
          }
          this.actions.push({
            type: 'swap',
            at: this.elapsed,
            idleElapsed: this.idleElapsed,
            r: r,
            c: c,
            rr: rr,
            cc: cc
          });
          this.exchange = {
            preferences: this.GetOrder().preferences,
            cascade: 1,
            timeAdded: 0,
            collected: 0,
            player: true,
            destination: {
              r: rr,
              c: cc
            },
            source: {
              r: r,
              c: c
            },
            startScore: this.score
          };
          var before = Copy(this.board);
          Swap(this.board, r, c, rr, cc);
          this.phase = 'swap';
          this.phaseRemaining = SWAP_DURATION;
          this.Emit({
            type: 'swap',
            from: {
              r: r,
              c: c
            },
            to: {
              r: rr,
              c: cc
            },
            before: before,
            after: Copy(this.board),
            duration: SWAP_DURATION
          });
          return true;
        };
        _proto.Mark = function Mark(set, r, c, origin, kind) {
          if (Inside(r, c) && this.board[r][c]) {
            var k = key(r, c);
            var m = set.get(k);
            if (!m) {
              var _ref;
              m = {
                r: r,
                c: c,
                origin: (_ref = origin != null ? origin : this.exchange.origin) != null ? _ref : 'base'
              };
              set.set(k, m);
            }
            if (kind) m[kind] = true;
          }
        };
        _proto.BuildMatches = function BuildMatches() {
          var set = new Map();
          var creations = {};
          var runs = Matches(this.board);
          var membership = {};
          for (var _iterator3 = _createForOfIteratorHelperLoose(runs), _step3; !(_step3 = _iterator3()).done;) {
            var run = _step3.value;
            for (var _iterator6 = _createForOfIteratorHelperLoose(run.cells), _step6; !(_step6 = _iterator6()).done;) {
              var _membership$k;
              var p = _step6.value;
              this.Mark(set, p.r, p.c);
              var k = key(p.r, p.c);
              membership[k] = (_membership$k = membership[k]) != null ? _membership$k : {};
              membership[k][run.axis] = true;
            }
          }
          for (var _iterator4 = _createForOfIteratorHelperLoose(runs), _step4; !(_step4 = _iterator4()).done;) {
            var _run = _step4.value;
            var candidate = _run.cells[Math.ceil(_run.cells.length / 2) - 1];
            var special = false;
            if (_run.cells.length >= 5) special = 'rainbow';else {
              for (var _iterator7 = _createForOfIteratorHelperLoose(_run.cells), _step7; !(_step7 = _iterator7()).done;) {
                var _p = _step7.value;
                var member = membership[key(_p.r, _p.c)];
                if (member[1] && member[2]) {
                  candidate = _p;
                  special = 'bomb';
                  break;
                }
              }
              if (!special && _run.cells.length === 4) special = _run.axis === 1 ? 'row' : 'column';
            }
            if (special) {
              if (special !== 'bomb' && this.exchange.cascade === 1 && this.exchange.destination) {
                for (var _iterator8 = _createForOfIteratorHelperLoose(_run.cells), _step8; !(_step8 = _iterator8()).done;) {
                  var _p2 = _step8.value;
                  if (_p2.r === this.exchange.destination.r && _p2.c === this.exchange.destination.c) candidate = _p2;
                }
              }
              var _k = key(candidate.r, candidate.c);
              var existing = creations[_k];
              if (!existing || special === 'rainbow') creations[_k] = {
                r: candidate.r,
                c: candidate.c,
                kind: _run.kind,
                special: special
              };
            }
          }
          // A connected T/L is one bomb, not separate four-line outputs.
          for (var _iterator5 = _createForOfIteratorHelperLoose(runs), _step5; !(_step5 = _iterator5()).done;) {
            var _run2 = _step5.value;
            var intersection = false;
            for (var _iterator9 = _createForOfIteratorHelperLoose(_run2.cells), _step9; !(_step9 = _iterator9()).done;) {
              var _p4 = _step9.value;
              var m = membership[key(_p4.r, _p4.c)];
              if (m[1] && m[2]) intersection = true;
            }
            if (intersection && _run2.cells.length < 5) {
              for (var _iterator10 = _createForOfIteratorHelperLoose(_run2.cells), _step10; !(_step10 = _iterator10()).done;) {
                var _p3 = _step10.value;
                var _k2 = key(_p3.r, _p3.c);
                if (creations[_k2] && creations[_k2].special !== 'bomb' && creations[_k2].special !== 'rainbow') delete creations[_k2];
              }
            }
          }
          OnMatches(this, runs);
          return [set, creations];
        };
        _proto.ExpandSpecials = function ExpandSpecials(set) {
          var activated = {};
          var effects = [];
          var changed = true;
          while (changed) {
            changed = false;
            for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
              var k = key(r, c);
              var cell = this.board[r][c];
              if (set.has(k) && !activated[k] && cell && cell.special) {
                var _ref2, _cell$origin;
                activated[k] = true;
                changed = true;
                var s = cell.special;
                var origin = (_ref2 = (_cell$origin = cell.origin) != null ? _cell$origin : this.exchange.origin) != null ? _ref2 : 'base';
                OnSpecial(this, s);
                // 引信: every bomb or line blast charges the cats on duty (they act at the next stable board).
                if (this.ownedUpgrades.bake_fuse && (s === 'bomb' || s === 'row' || s === 'column')) {
                  for (var _iterator11 = _createForOfIteratorHelperLoose(this.cats), _step11; !(_step11 = _iterator11()).done;) {
                    var cat = _step11.value;
                    var need = CatLevel(cat.id, cat.level).charge;
                    cat.charge = Math.min(need, cat.charge + ITEM_TUNING.fuseCharge);
                  }
                }
                if (s === 'row' || s === 'column') {
                  var wide = this.ownedUpgrades.ribbon_wide;
                  effects.push({
                    type: 'effect',
                    kind: s,
                    r: r,
                    c: c,
                    cross: this.ownedUpgrades.ribbon_cross,
                    wide: wide
                  });
                  // 宽幅缎带: the neighbouring row / column too (the one below / right, or above / left at the edge).
                  var r2 = wide ? r < N ? r + 1 : r - 1 : r;
                  var c2 = wide ? c < N ? c + 1 : c - 1 : c;
                  for (var i = 1; i <= N; i++) {
                    if (s === 'row' || this.ownedUpgrades.ribbon_cross) {
                      this.Mark(set, r, i, origin, 'line');
                      this.Mark(set, r2, i, origin, 'line');
                    }
                    if (s === 'column' || this.ownedUpgrades.ribbon_cross) {
                      this.Mark(set, i, c, origin, 'line');
                      this.Mark(set, i, c2, origin, 'line');
                    }
                  }
                } else if (s === 'bomb') {
                  var radius = this.ownedUpgrades.bake_tray ? ITEM_TUNING.trayRadius : 1;
                  effects.push({
                    type: 'effect',
                    kind: 'bomb',
                    r: r,
                    c: c,
                    radius: radius
                  });
                  for (var rr = r - radius; rr <= r + radius; rr++) for (var cc = c - radius; cc <= c + radius; cc++) this.Mark(set, rr, cc, origin, 'bomb');
                } else if (s === 'rainbow') {
                  var _this$exchange$rainbo;
                  var kind = (_this$exchange$rainbo = this.exchange.rainbowKind) != null ? _this$exchange$rainbo : this.exchange.preferences[0];
                  effects.push({
                    type: 'effect',
                    kind: 'rainbow',
                    r: r,
                    c: c,
                    targetKind: kind
                  });
                  for (var _rr = 1; _rr <= N; _rr++) for (var _cc = 1; _cc <= N; _cc++) {
                    if (this.board[_rr][_cc] && this.board[_rr][_cc].kind === kind) this.Mark(set, _rr, _cc, origin);
                  }
                }
              }
            }
          }
          return effects;
        };
        _proto.Clear = function Clear(set, creations) {
          var _this$exchange$startS2;
          var effects = this.ExpandSpecials(set);
          if (set.size === 0) {
            this.Stable();
            return;
          }
          var before = Copy(this.board);
          var snapshot = this.Snapshot();
          var cells = [];
          var value = 0,
            count = 0;
          var breakdown = {};
          var multiplier = Math.min(3, 1 + (this.exchange.cascade - 1) * 0.5);
          for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
            var mark = set.get(key(r, c));
            if (!mark) continue;
            var cell = this.board[r][c];
            if (cell) {
              cells.push({
                r: r,
                c: c,
                cell: before[r][c]
              });
              if (!cell.credited) {
                var _ref3, _cell$origin2, _breakdown$origin;
                count++;
                // 心愿清单: 偏好品 score ITEM_TUNING.prefMult times instead of twice. Whole points only.
                var base = Math.floor(SCORE_PER_GOOD * (this.IsPreferred(cell.kind) ? this.ownedUpgrades.display_feature ? ITEM_TUNING.prefMult : 2 : 1) * multiplier + .000001);
                var origin = (_ref3 = (_cell$origin2 = cell.origin) != null ? _cell$origin2 : mark.origin) != null ? _ref3 : 'base';
                // Goods a cat's skill clears score C.CAT_SCORE_MULT[cat] times.
                if (origin.slice(0, 4) === 'pet:') {
                  var _C$CAT_SCORE_MULT$ori;
                  var mult = (_C$CAT_SCORE_MULT$ori = CAT_SCORE_MULT[origin.slice(4)]) != null ? _C$CAT_SCORE_MULT$ori : 1;
                  if (mult !== 1) base = Math.floor(base * mult + .000001);
                }
                breakdown[origin] = ((_breakdown$origin = breakdown[origin]) != null ? _breakdown$origin : 0) + base;
                value = value + base;
                for (var _i = 0, _Object$entries = Object.entries(Bonus(this, base, mark, cell.kind)); _i < _Object$entries.length; _i++) {
                  var _breakdown$source;
                  var _Object$entries$_i = _Object$entries[_i],
                    source = _Object$entries$_i[0],
                    bonus = _Object$entries$_i[1];
                  breakdown[source] = ((_breakdown$source = breakdown[source]) != null ? _breakdown$source : 0) + bonus;
                  value = value + bonus;
                }
                Collected(this, cell.kind);
              }
              this.board[r][c] = undefined;
            }
          }
          for (var _r = 1; _r <= N; _r++) for (var _c = 1; _c <= N; _c++) {
            var p = creations[key(_r, _c)];
            if (p) this.board[_r][_c] = this.NewCell(p.kind, p.special, true);
          }
          this.exchange.collected = this.exchange.collected + count;
          // Clears and cascades add no time; only completed orders do. Credit each source once.
          for (var _i2 = 0, _Object$entries2 = Object.entries(breakdown); _i2 < _Object$entries2.length; _i2++) {
            var _Object$entries2$_i = _Object$entries2[_i2],
              _source = _Object$entries2$_i[0],
              amount = _Object$entries2$_i[1];
            this.Credit(amount, _source);
          }
          // Counter items pay with the clear, never in the middle of it.
          for (var _i3 = 0, _Object$entries3 = Object.entries(this.counterPending); _i3 < _Object$entries3.length; _i3++) {
            var _Object$entries3$_i = _Object$entries3[_i3],
              id = _Object$entries3$_i[0],
              _amount = _Object$entries3$_i[1];
            this.Credit(_amount, 'item:' + id);
            value = value + _amount;
          }
          this.counterPending = {};
          this.orderProgress = this.orderProgress + value;
          this.AddScore(0);
          this.phase = 'clear';
          this.phaseRemaining = CLEAR_DURATION;
          this.Emit({
            type: 'clear',
            before: before,
            after: Copy(this.board),
            cells: cells,
            specials: effects,
            score: value,
            count: count,
            cascade: this.exchange.cascade,
            duration: CLEAR_DURATION,
            snapshotBefore: snapshot,
            snapshotAfter: this.Snapshot(),
            chainScore: this.score - ((_this$exchange$startS2 = this.exchange.startScore) != null ? _this$exchange$startS2 : 0)
          });
        };
        _proto.BeginClear = function BeginClear() {
          var _this$BuildMatches = this.BuildMatches(),
            set = _this$BuildMatches[0],
            creations = _this$BuildMatches[1];
          var a = this.exchange.source,
            b = this.exchange.destination;
          if (this.exchange.cascade === 1 && a && b) {
            var ca = this.board[a.r][a.c],
              cb = this.board[b.r][b.c];
            if (ca.special === 'rainbow' || cb.special === 'rainbow') {
              this.exchange.rainbowKind = ca.special === 'rainbow' ? cb.kind : ca.kind;
              this.Mark(set, a.r, a.c);
              this.Mark(set, b.r, b.c);
            }
          }
          this.Clear(set, creations);
        };
        _proto.Stable = function Stable() {
          var _this2 = this;
          this.RecordChain();
          // Time running out mid-cascade no longer ends the run here; the run ends below, once settled.
          var over = this.timeUp || this.time <= 0 || this.elapsed >= SESSION_LIMIT - 0.000001;
          if (this.exchange.player) {
            var amount = Math.min(12, this.exchange.collected);
            for (var _iterator12 = _createForOfIteratorHelperLoose(this.cats), _step12; !(_step12 = _iterator12()).done;) {
              var cat = _step12.value;
              var need = CatLevel(cat.id, cat.level).charge;
              cat.charge = Math.min(need, cat.charge + amount);
              if (cat.charge >= need) this.QueueCat(cat);
              if (this.exchange.collected >= 12 || this.exchange.cascade >= 2) {
                this.Emit({
                  type: 'cat',
                  id: cat.id,
                  clip: this.exchange.collected >= 24 && cat.level >= 3 ? 'celebrate' : 'cheer'
                });
              }
            }
            this.exchange.player = false;
          }
          // A cat filled outside a player exchange (引信 blasts) acts at this stable board too.
          for (var _iterator13 = _createForOfIteratorHelperLoose(this.cats), _step13; !(_step13 = _iterator13()).done;) {
            var _cat = _step13.value;
            if (_cat.charge >= CatLevel(_cat.id, _cat.level).charge) this.QueueCat(_cat);
          }
          if (this.petQueue.length > 0) {
            this.ActivateCat(this.petQueue.shift());
            return;
          }
          if (over) {
            this.Finish();
            return;
          }
          var before = Copy(this.board);
          if (EnsureMove(this.board, function (n) {
            return _this2.Random(n);
          }, Pool(this))) {
            this.Emit({
              type: 'shuffle',
              before: before,
              after: Copy(this.board),
              duration: FALL_DURATION
            });
          }
          this.Emit({
            type: 'settled',
            after: Copy(this.board)
          });
          if (this.time <= 0 || this.elapsed >= SESSION_LIMIT - 0.000001) this.Finish();else if (this.pendingUpgrades > 0) this.OfferUpgrades();else if (this.time <= 0) this.Finish();else {
            this.phase = 'idle';
            this.phaseRemaining = 0;
          }
        }
        // Each cat is queued once: 奶茶 filling a partner that is already waiting must not make it act twice.
        ;

        _proto.QueueCat = function QueueCat(cat) {
          if (this.petQueue.includes(cat)) return;
          this.petQueue.push(cat);
        };
        _proto.ActivateCat = function ActivateCat(cat) {
          cat.charge = 0;
          cat.uses = cat.uses + 1;
          var skillEvent = {
            type: 'cat',
            id: cat.id,
            clip: 'assist',
            targets: []
          };
          this.Emit(skillEvent);
          var skill = Cat(cat.id).skill;
          this.metrics.catUses[cat.id] = cat.uses;
          this.exchange = {
            preferences: this.GetOrder().preferences,
            cascade: 1,
            player: false,
            collected: 0,
            origin: 'pet:' + cat.id,
            startScore: this.score
          };
          var power = CatLevel(cat.id, cat.level).power;
          // Flat 20 per activation.
          this.AddScore(20 + (skill === 'score' ? power : 0), 'pet:' + cat.id);
          if (skill === 'time') this.AddTime(power, Cat(cat.id).name);
          if (skill === 'collect') {
            // 团团 turns goods into the order's 偏好品 (the 同款陈列 flip).
            var before = Copy(this.board);
            var fx = Convert(this, power, 'pet:' + cat.id);
            for (var _iterator14 = _createForOfIteratorHelperLoose(fx.targets), _step14; !(_step14 = _iterator14()).done;) {
              var t = _step14.value;
              skillEvent.targets.push(t);
            }
            this.Emit({
              type: 'transform',
              before: before,
              after: Copy(this.board),
              origin: 'pet:' + cat.id,
              targets: skillEvent.targets
            });
            // Converted goods can complete a line: clear it now, like an item pick that changes the board.
            if (Matches(this.board).length > 0) {
              this.exchange = {
                preferences: this.GetOrder().preferences,
                cascade: 1,
                collected: 0,
                player: false,
                startScore: this.score
              };
              this.BeginClear();
              return;
            }
          } else if (skill === 'cuddle') {
            // 布偶猫: charge the partner by a share of what it needs; alone, restore time instead.
            var partner;
            for (var _iterator15 = _createForOfIteratorHelperLoose(this.cats), _step15; !(_step15 = _iterator15()).done;) {
              var other = _step15.value;
              if (other !== cat) partner = other;
            }
            if (partner) {
              var need = CatLevel(partner.id, partner.level).charge;
              var beforeCharge = partner.charge;
              partner.charge = Math.min(need, partner.charge + Math.ceil(need * power / 100));
              if (partner.charge >= need) this.QueueCat(partner);
              skillEvent.targets = [{
                cat: partner.id
              }];
              this.Emit({
                type: 'cat_charge',
                id: partner.id,
                from: cat.id,
                before: beforeCharge,
                after: partner.charge,
                amount: partner.charge - beforeCharge,
                need: need
              });
            } else {
              var lv = Math.max(1, Math.min(5, cat.level || 1));
              var alone = CUDDLE_ALONE_SECONDS;
              var seconds = alone[0];
              if (lv >= 5) seconds = alone[2];else if (lv >= 3) seconds = alone[1];
              this.AddTime(seconds, Cat(cat.id).name);
              skillEvent.targets = [{
                hud: 'timer'
              }];
            }
          } else if (skill === 'detonate') {
            // 奶牛猫: set off bombs already on the board (up to power); with none, place two.
            var set = new Map();
            var count = 0;
            for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
              var cell = this.board[r][c];
              if (cell && cell.special === 'bomb' && count < power) {
                this.Mark(set, r, c);
                count++;
              }
            }
            if (count > 0) {
              this.Clear(set, {});
              // ExpandSpecials can ignite additional bombs; use every bomb actually exploded.
              for (var i = this.events.length - 1; i >= 0; i--) {
                var e = this.events[i];
                if (e.type === 'clear') {
                  for (var _i4 = 0, _arr = e.specials; _i4 < _arr.length; _i4++) {
                    var _fx = _arr[_i4];
                    if (_fx.kind === 'bomb') skillEvent.targets.push({
                      r: _fx.r,
                      c: _fx.c
                    });
                  }
                  break;
                }
              }
              return;
            }
            var _before = Copy(this.board);
            for (var _i5 = 1; _i5 <= 2; _i5++) {
              var _Rules$Place = Place(this, 'bomb', 'pet:' + cat.id),
                ok = _Rules$Place[0],
                p = _Rules$Place[1];
              if (ok) skillEvent.targets.push(p);
            }
            this.Emit({
              type: 'transform',
              before: _before,
              after: Copy(this.board),
              origin: 'pet:' + cat.id,
              targets: skillEvent.targets
            });
          } else if (skill === 'line' || skill === 'bomb') {
            var _before2 = Copy(this.board);
            for (var _i6 = 1; _i6 <= power; _i6++) {
              var _Rules$Place2 = Place(this, skill === 'bomb' ? 'bomb' : this.Random(2) === 1 ? 'row' : 'column', 'pet:' + cat.id),
                _ok = _Rules$Place2[0],
                _p5 = _Rules$Place2[1];
              if (_ok) skillEvent.targets.push(_p5);
            }
            this.Emit({
              type: 'transform',
              before: _before2,
              after: Copy(this.board),
              origin: 'pet:' + cat.id,
              targets: skillEvent.targets
            });
          }
          this.Stable();
        };
        _proto.OfferUpgrades = function OfferUpgrades() {
          this.replacing = false;
          var pool = [];
          this.choices = [];
          for (var _iterator16 = _createForOfIteratorHelperLoose(ReleasePool()), _step16; !(_step16 = _iterator16()).done;) {
            var u = _step16.value;
            if (!this.ownedUpgrades[u.id]) pool.push(u);
          }
          // All three are uniformly random among the unowned release items.
          while (this.choices.length < 3 && pool.length > 0) this.choices.push(pool.splice(this.Random(pool.length) - 1, 1)[0]);
          this.phase = 'upgrade';
          this.phaseRemaining = 0;
          this.Emit({
            type: 'upgrade',
            choices: this.choices,
            replacing: this.replacing
          });
        };
        _proto.GetUpgradeChoices = function GetUpgradeChoices() {
          return this.choices;
        };
        _proto.ChooseUpgrade = function ChooseUpgrade(id, replace) {
          if (this.phase !== 'upgrade') return false;
          if (replace !== undefined && replace !== null) return false;
          if (this.pendingUpgrades <= 0 || Count(this) >= UpgradeSlotCap()) return false;
          var selected = this.choices.find(function (u) {
            return u.id === id;
          });
          if (!selected) return false;
          this.pendingUpgrades = this.pendingUpgrades - 1;
          this.ownedUpgrades[id] = true;
          this.upgradeOrder.push(id);
          if (selected.route !== 'general') this.lastRoute = selected.route;
          if (id === 'general_stamp') this.stampFrom = this.orderIndex + 1;
          this.actions.push({
            type: 'upgrade',
            at: this.elapsed,
            idleElapsed: this.idleElapsed,
            id: id,
            replace: replace
          });
          this.choices = [];
          if (Matches(this.board).length > 0) {
            this.exchange = {
              preferences: this.GetOrder().preferences,
              cascade: 1,
              collected: 0,
              player: false,
              startScore: this.score
            };
            this.BeginClear();
          } else if (this.time <= 0 || this.elapsed >= SESSION_LIMIT - 0.000001) this.Finish();else if (this.pendingUpgrades > 0) this.OfferUpgrades();else {
            this.phase = 'idle';
            this.phaseRemaining = 0;
          }
          return true;
        };
        _proto.GetRerollRemaining = function GetRerollRemaining() {
          return this.rerollRemaining;
        };
        _proto.GetRerollBudget = function GetRerollBudget() {
          return this.rerollBudget;
        };
        _proto.GetRerollAdUsed = function GetRerollAdUsed() {
          return this.rerollAdUsed;
        };
        _proto.CanGrantRerollAd = function CanGrantRerollAd() {
          if (this.phase !== 'upgrade') return [false, 'not_upgrade_phase'];
          if (this.choices.length === 0) return [false, 'empty_pool'];
          if (this.rerollAdUsed) return [false, 'ad_already_used'];
          if (this.rerollRemaining > 0) return [false, 'free_budget_remaining'];
          return [true];
        }
        // Called only after a successful video and durable quota save; does not touch either RNG stream.
        ;

        _proto.GrantRerollAd = function GrantRerollAd() {
          var _this$CanGrantRerollA = this.CanGrantRerollAd(),
            ok = _this$CanGrantRerollA[0],
            reason = _this$CanGrantRerollA[1];
          if (!ok) return [false, reason];
          this.rerollAdUsed = true;
          this.rerollRemaining = this.rerollRemaining + REROLL_AD_AMOUNT;
          this.actions.push({
            type: 'reroll_ad',
            at: this.elapsed,
            idleElapsed: this.idleElapsed
          });
          this.Emit({
            type: 'reroll_ad',
            remaining: this.rerollRemaining,
            budget: this.rerollBudget
          });
          return [true];
        };
        _proto.TryReroll = function TryReroll() {
          var _this3 = this;
          if (this.phase !== 'upgrade') return [false, 'not_upgrade_phase'];
          if (this.rerollRemaining <= 0) return [false, 'no_budget'];
          if (this.choices.length === 0) return [false, 'empty_pool'];
          var current = new Set(this.choices.map(function (u) {
            return u.id;
          }));
          var pool = ReleasePool().filter(function (u) {
            return !_this3.ownedUpgrades[u.id] && !current.has(u.id);
          });
          if (pool.length === 0) return [false, 'empty_pool'];
          var choices = [];
          while (choices.length < 3 && pool.length > 0) choices.push(pool.splice(this.RerollRandom(pool.length) - 1, 1)[0]);
          this.choices = choices;
          this.rerollRemaining = this.rerollRemaining - 1;
          this.actions.push({
            type: 'reroll',
            at: this.elapsed,
            idleElapsed: this.idleElapsed
          });
          this.Emit({
            type: 'reroll',
            choices: this.choices,
            remaining: this.rerollRemaining,
            budget: this.rerollBudget
          });
          return [true];
        }
        // manual: the player ends the run from pause (a replayable 'finish' action).
        ;

        _proto.Finish = function Finish(manual) {
          if (this.phase === 'finished') return;
          if (manual) this.actions.push({
            type: 'finish',
            at: this.elapsed,
            idleElapsed: this.idleElapsed
          });
          this.RecordChain();
          this.time = 0;
          this.phase = 'finished';
          this.Emit({
            type: 'finished',
            score: this.score,
            completedOrders: this.completedOrders
          });
          for (var _iterator17 = _createForOfIteratorHelperLoose(this.cats), _step17; !(_step17 = _iterator17()).done;) {
            var cat = _step17.value;
            this.Emit({
              type: 'cat',
              id: cat.id,
              clip: 'celebrate',
              context: 'ending'
            });
          }
        };
        _proto.Update = function Update(dt) {
          var _this4 = this;
          if (!(typeof dt === 'number' && dt >= 0 && dt < Infinity)) throw new Error('invalid timestep');
          if (this.phase === 'finished' || this.phase === 'upgrade') return;
          if (this.phase === 'idle') {
            var _consumed = Math.min(this.time, dt, Math.max(0, SESSION_LIMIT - this.elapsed));
            this.elapsed = this.elapsed + _consumed;
            this.idleElapsed = this.idleElapsed + _consumed;
            this.time = Math.max(0, this.time - _consumed);
            if (this.time < 0.000001 || this.elapsed >= SESSION_LIMIT - 0.000001) this.Finish();
            return;
          }
          // Phase overshoot is not part of the simulation clock, keeping replay independent of FPS.
          var consumed = Math.min(dt, Math.max(0, this.phaseRemaining));
          this.elapsed = this.elapsed + consumed;
          this.time = Math.max(0, this.time - consumed);
          if (this.time <= 0) this.timeUp = true;
          this.phaseRemaining = this.phaseRemaining - dt;
          if (this.phaseRemaining > 0) return;
          if (this.phase === 'swap') this.BeginClear();else if (this.phase === 'clear') {
            var before = Copy(this.board);
            var moves = Fall(this.board, function () {
              return RefillKind(_this4);
            }, function (k) {
              var cell = _this4.NewCell(k);
              cell.origin = _this4.refillOrigin;
              return cell;
            });
            var itemVfx = AfterRefill(this);
            this.phase = 'fall';
            this.phaseRemaining = FALL_DURATION;
            this.Emit({
              type: 'fall',
              before: before,
              after: Copy(this.board),
              moves: moves,
              duration: FALL_DURATION,
              itemVfx: itemVfx
            });
          } else if (this.phase === 'fall') {
            if (Matches(this.board).length > 0) {
              this.exchange.cascade = this.exchange.cascade + 1;
              this.BeginClear();
            } else this.Stable();
          }
        };
        return Run;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/runtime.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './types.ts', './localStorage.ts', './audio.ts', './dev.ts'], function (exports) {
  var _asyncToGenerator, _regeneratorRuntime, cclegacy, sys, native, SUPPORTED_LANGUAGES, pickLanguage, mapLocaleTag, savedLanguage, keyValueGate, localStorageGate, setHostMuted, fakeAds;
  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
      native = module.native;
    }, function (module) {
      SUPPORTED_LANGUAGES = module.SUPPORTED_LANGUAGES;
      pickLanguage = module.pickLanguage;
      mapLocaleTag = module.mapLocaleTag;
      savedLanguage = module.savedLanguage;
    }, function (module) {
      keyValueGate = module.keyValueGate;
      localStorageGate = module.localStorageGate;
    }, function (module) {
      setHostMuted = module.setHostMuted;
    }, function (module) {
      fakeAds = module.fakeAds;
    }],
    execute: function () {
      exports({
        nativeDebugFixture: nativeDebugFixture,
        pick: pick,
        pickGameLanguage: pickGameLanguage
      });
      cclegacy._RF.push({}, "f96a9G979ZBwLI10cCsKbhL", "runtime", undefined);

      // The ad consent form again, for players whose region needs a way to change their choice (AdMob UMP: shown as a
      // settings entry only while required() says so).
      // The game language (docs/port-plan.md §9): ?lang=<code> on the web for testing, else the system / browser languages
      // in order, mapped to the supported languages; overseas builds fall back to English, not to the Chinese source.
      // A portal locale (CrazyGames systemInfo.locale) comes before the browser's; the player's own choice in the settings
      // (saved, 2026-10-30) before both.
      function pickGameLanguage(portalLocale, saved) {
        var _G$location$search, _G$location, _exec, _nav$languages;
        var query = (_G$location$search = (_G$location = G.location) == null ? void 0 : _G$location.search) != null ? _G$location$search : '';
        var forced = (_exec = /[?&]lang=([A-Za-z_]+)/.exec(query)) == null ? void 0 : _exec[1];
        if (forced && SUPPORTED_LANGUAGES.includes(forced)) return forced;
        var chosen = savedLanguage(saved);
        if (chosen) return chosen;
        var nav = globalThis.navigator;
        var browser = sys.isNative ? [sys.languageCode] : (_nav$languages = nav == null ? void 0 : nav.languages) != null ? _nav$languages : nav != null && nav.language ? [nav.language] : [];
        var tags = portalLocale ? [portalLocale].concat(browser) : browser;
        return pickLanguage(tags.map(function (t) {
          return mapLocaleTag(t);
        }).filter(function (c) {
          return c !== undefined;
        }), 'en');
      }

      // YouTube Playables SDK v1 (developers.google.com/youtube/gaming/playables/reference/sdk, checked 2026-10-30).

      var G = globalThis;
      function crazyGames() {
        var sdk = function sdk() {
          var _G$CrazyGames;
          return (_G$CrazyGames = G.CrazyGames) == null ? void 0 : _G$CrazyGames.SDK;
        };
        var ready = false;
        return {
          id: 'crazygames',
          init: function init() {
            return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              var _sdk;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return (_sdk = sdk()) == null ? void 0 : _sdk.init();
                  case 3:
                    ready = sdk() !== undefined;
                    _context.next = 9;
                    break;
                  case 6:
                    _context.prev = 6;
                    _context.t0 = _context["catch"](0);
                    console.warn('[Platform] CrazyGames init failed', _context.t0);
                  case 9:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[0, 6]]);
            }))();
          },
          locale: function locale() {
            try {
              var _sdk2;
              return ready ? (_sdk2 = sdk()) == null || (_sdk2 = _sdk2.user) == null || (_sdk2 = _sdk2.systemInfo) == null ? void 0 : _sdk2.locale : undefined;
            } catch (_unused) {
              return undefined;
            }
          },
          // Saves go through the data module (the portal asks games not to rely on local saves).
          storage: function storage(prefix) {
            return ready ? keyValueGate(sdk().data, prefix) : localStorageGate(prefix);
          },
          ads: {
            name: 'crazygames',
            available: function available() {
              return ready;
            },
            show: function show(done, started) {
              sdk().ad.requestAd('rewarded', {
                adStarted: function adStarted() {
                  return started == null ? void 0 : started();
                },
                adFinished: function adFinished() {
                  return done(true);
                },
                adError: function adError(e) {
                  var _e$code;
                  return done(false, (_e$code = e == null ? void 0 : e.code) != null ? _e$code : 'error');
                }
              });
              return true;
            }
          },
          commercialBreak: function commercialBreak() {
            return new Promise(function (done) {
              if (!ready) {
                done();
                return;
              }
              try {
                sdk().ad.requestAd('midgame', {
                  adFinished: function adFinished() {
                    return done();
                  },
                  adError: function adError() {
                    return done();
                  }
                });
              } catch (_unused2) {
                done();
              }
            });
          },
          loadingStart: function loadingStart() {
            if (ready) sdk().game.loadingStart();
          },
          loadingStop: function loadingStop() {
            if (ready) sdk().game.loadingStop();
          },
          gameplay: function gameplay(active) {
            if (ready) {
              if (active) sdk().game.gameplayStart();else sdk().game.gameplayStop();
            }
          }
        };
      }
      function poki() {
        var sdk = function sdk() {
          return G.PokiSDK;
        };
        var ready = false;
        return {
          id: 'poki',
          // The game continues even when init fails (ad blockers).
          init: function init() {
            return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
              var _sdk3;
              return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.prev = 0;
                    _context2.next = 3;
                    return (_sdk3 = sdk()) == null ? void 0 : _sdk3.init();
                  case 3:
                    ready = sdk() !== undefined;
                    _context2.next = 9;
                    break;
                  case 6:
                    _context2.prev = 6;
                    _context2.t0 = _context2["catch"](0);
                    console.warn('[Platform] Poki init failed', _context2.t0);
                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, null, [[0, 6]]);
            }))();
          },
          storage: function storage(prefix) {
            return localStorageGate(prefix);
          },
          ads: {
            name: 'poki',
            available: function available() {
              return ready;
            },
            show: function show(done, started) {
              sdk().rewardedBreak(function () {
                return started == null ? void 0 : started();
              }).then(function (success) {
                return done(success === true);
              }, function () {
                return done(false, 'error');
              });
              return true;
            }
          },
          commercialBreak: function commercialBreak() {
            return ready ? sdk().commercialBreak()["catch"](function () {
              return undefined;
            }) : Promise.resolve();
          },
          loadingStart: function loadingStart() {},
          loadingStop: function loadingStop() {
            if (ready) sdk().gameLoadingFinished();
          },
          gameplay: function gameplay(active) {
            if (ready) {
              if (active) sdk().gameplayStart();else sdk().gameplayStop();
            }
          }
        };
      }
      // YouTube Playables: cloud saves through saveData / loadData (one JSON object for all keys, loaded before any save),
      // the host's language, mute and pause, and its ads when the SDK offers them. Outside YouTube the SDK is a no-op.
      function youtube() {
        var yt = function yt() {
          return G.ytgame;
        };
        var ready = false,
          locale;
        var store = {};
        var saving = Promise.resolve();
        var cloud = {
          getItem: function getItem(key) {
            var _store$key;
            return (_store$key = store[key]) != null ? _store$key : null;
          },
          setItem: function setItem(key, value) {
            store[key] = value;
            var data = JSON.stringify(store);
            // Saves go out one after another, so an older one cannot land after a newer one.
            saving = saving.then(function () {
              return yt().game.saveData(data);
            })["catch"](function (e) {
              return console.warn('[Platform] YouTube save failed', e);
            });
          }
        };
        return {
          id: 'youtube',
          init: function init() {
            return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
              var sdk, raw, parsed;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    sdk = yt();
                    if (sdk) {
                      _context3.next = 3;
                      break;
                    }
                    return _context3.abrupt("return");
                  case 3:
                    _context3.prev = 3;
                    _context3.next = 6;
                    return sdk.game.loadData();
                  case 6:
                    raw = _context3.sent;
                    parsed = raw ? JSON.parse(raw) : {};
                    if (parsed && typeof parsed === 'object') store = parsed;
                    ready = true;
                    _context3.next = 16;
                    break;
                  case 12:
                    _context3.prev = 12;
                    _context3.t0 = _context3["catch"](3);
                    console.warn('[Platform] YouTube load failed', _context3.t0);
                    ready = true;
                  case 16:
                    _context3.prev = 16;
                    _context3.next = 19;
                    return sdk.system.getLanguage();
                  case 19:
                    locale = _context3.sent;
                    _context3.next = 25;
                    break;
                  case 22:
                    _context3.prev = 22;
                    _context3.t1 = _context3["catch"](16);
                    locale = undefined;
                  case 25:
                    setHostMuted(!sdk.system.isAudioEnabled());
                    sdk.system.onAudioEnabledChange(function (enabled) {
                      return setHostMuted(!enabled);
                    });
                  case 27:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, null, [[3, 12], [16, 22]]);
            }))();
          },
          locale: function (_locale) {
            function locale() {
              return _locale.apply(this, arguments);
            }
            locale.toString = function () {
              return _locale.toString();
            };
            return locale;
          }(function () {
            return locale;
          }),
          storage: function storage(prefix) {
            return ready ? keyValueGate(cloud, prefix) : localStorageGate(prefix);
          },
          ads: {
            name: 'youtube',
            available: function available() {
              var _yt;
              return ready && ((_yt = yt()) == null ? void 0 : _yt.ads) !== undefined;
            },
            show: function show(done, started) {
              started == null || started();
              yt().ads.requestRewardedAd('result_bonus').then(function (ok) {
                return done(ok === true);
              }, function () {
                return done(false, 'error');
              });
              return true;
            }
          },
          commercialBreak: function commercialBreak() {
            var _yt2;
            return (_yt2 = yt()) != null && _yt2.ads ? yt().ads.requestInterstitialAd()["catch"](function () {
              return undefined;
            }) : Promise.resolve();
          },
          loadingShown: function loadingShown() {
            var _yt3;
            (_yt3 = yt()) == null || _yt3.game.firstFrameReady();
          },
          hostLifecycle: function hostLifecycle(pause, resume) {
            var _yt4, _yt5;
            (_yt4 = yt()) == null || _yt4.system.onPause(pause);
            (_yt5 = yt()) == null || _yt5.system.onResume(resume);
          },
          loadingStart: function loadingStart() {},
          loadingStop: function loadingStop() {
            var _yt6;
            (_yt6 = yt()) == null || _yt6.game.gameReady();
          },
          gameplay: function gameplay() {}
        };
      }
      function plainWeb() {
        var _G$location2, _G$location3;
        // ?ads=fake: the dev rewarded-ad adapter (always completes), so the ad entries can be shown and driven.
        var fake = ((_G$location2 = G.location) == null ? void 0 : _G$location2.search.includes('ads=fake')) === true;
        // ?privacy=fake: a region that needs the privacy options (the settings row shows; the "form" closes at once).
        var fakePrivacy = ((_G$location3 = G.location) == null ? void 0 : _G$location3.search.includes('privacy=fake')) === true ? {
          required: function required(done) {
            return done(true);
          },
          show: function show(done) {
            console.log('[Platform] fake privacy form');
            done(true);
          }
        } : undefined;
        return {
          id: fake ? 'dev' : 'web',
          init: function () {
            var _init = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            function init() {
              return _init.apply(this, arguments);
            }
            return init;
          }(),
          storage: function storage(prefix) {
            return localStorageGate(prefix);
          },
          ads: fake ? fakeAds() : undefined,
          privacy: fakePrivacy,
          loadingStart: function loadingStart() {},
          loadingStop: function loadingStop() {},
          gameplay: function gameplay() {}
        };
      }

      // Android: AdMob rewarded video through native/engine/android/app/src/com/cocos/game/AdMobBridge.java (JsbBridge).
      // The unit id comes from the build (AdMobBridge.configuredUnit: the manifest value from ADMOB_REWARDED_ID, Google's test
      // unit otherwise); '' asks for it.
      var ADMOB_REWARDED_CONFIGURED = '';
      // native.bridge has one handler: route messages by channel.
      var nativeHandlers = {};
      function onNative(channel, handler) {
        nativeHandlers[channel] = handler;
        native.bridge.onNative = function (ch, message) {
          var _nativeHandlers$ch;
          return (_nativeHandlers$ch = nativeHandlers[ch]) == null ? void 0 : _nativeHandlers$ch.call(nativeHandlers, message != null ? message : '');
        };
      }
      // Debug builds on Android: the test state named by the launch intent (tools/android-fixture.ps1), '' when none.
      function nativeDebugFixture(done) {
        if (!sys.isNative || sys.os !== sys.OS.ANDROID) {
          done('');
          return;
        }
        onNative('debug', function (message) {
          return done(message);
        });
        native.bridge.sendToNative('debug', '?');
      }
      function admob(unitId) {
        if (unitId === void 0) {
          unitId = ADMOB_REWARDED_CONFIGURED;
        }
        var pending;
        onNative('admob', function (message) {
          if (!pending || !message) return;
          if (message === 'started') {
            pending.started == null || pending.started();
            return;
          }
          var p = pending;
          pending = undefined;
          if (message === 'success') p.done(true);else p.done(false, message.replace(/^fail:/, ''));
        });
        return {
          name: 'admob',
          available: function available() {
            return true;
          },
          show: function show(done, started) {
            if (pending) return false;
            pending = {
              done: done,
              started: started
            };
            native.bridge.sendToNative('admob', 'show:' + unitId);
            return true;
          }
        };
      }

      // Android: the consent status and form from AdMobBridge (channel "privacy", replies "required" | "none").
      function admobPrivacy() {
        var waiting = [];
        var watcher;
        // Replies go to the callers waiting for them; a message nobody asked for is the status pushed after the launch's
        // consent update (AdMobBridge), for the watcher.
        onNative('privacy', function (message) {
          var w = waiting;
          waiting = [];
          for (var _i = 0, _w = w; _i < _w.length; _i++) {
            var _done = _w[_i];
            _done(message === 'required');
          }
          if (w.length === 0) watcher == null || watcher(message === 'required');
        });
        var ask = function ask(request, done) {
          waiting.push(done);
          native.bridge.sendToNative('privacy', request);
        };
        return {
          required: function required(done) {
            return ask('status', done);
          },
          show: function show(done) {
            return ask('show', done);
          },
          watch: function watch(changed) {
            watcher = changed;
          }
        };
      }
      function pick() {
        if (!sys.isNative) {
          if (G.__PORTAL === 'crazygames') return crazyGames();
          if (G.__PORTAL === 'poki') return poki();
          if (G.__PORTAL === 'youtube') return youtube();
          return plainWeb();
        }
        // Native: local saves; Android has AdMob rewarded video, iOS gets its adapter with the iOS build.
        var android = sys.os === sys.OS.ANDROID;
        return {
          id: android ? 'android' : 'ios',
          init: function () {
            var _init2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            function init() {
              return _init2.apply(this, arguments);
            }
            return init;
          }(),
          storage: function storage(prefix) {
            return localStorageGate(prefix);
          },
          ads: android ? admob() : undefined,
          privacy: android ? admobPrivacy() : undefined,
          loadingStart: function loadingStart() {},
          loadingStop: function loadingStop() {},
          gameplay: function gameplay() {}
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/settings.ts", ['cc', './kit.ts', './skin.ts', './i18n.ts', './audio.ts', './language.ts', './types.ts', './home.ts', './text.ts'], function (exports) {
  var cclegacy, UI, Image, Face, Text, ink, FaceText, ImageButton, Row, warmRed, muted, L, language, playCue, applySettings, languageName, PICKER_LANGUAGES, base, textWidth;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Face = module.Face;
      Text = module.Text;
      ink = module.ink;
      FaceText = module.FaceText;
      ImageButton = module.ImageButton;
      Row = module.Row;
      warmRed = module.warmRed;
      muted = module.muted;
    }, function (module) {
      L = module.L;
      language = module.language;
    }, function (module) {
      playCue = module.playCue;
      applySettings = module.applySettings;
    }, function (module) {
      languageName = module.languageName;
    }, function (module) {
      PICKER_LANGUAGES = module.PICKER_LANGUAGES;
    }, function (module) {
      base = module.base;
    }, function (module) {
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports('Settings', Settings);
      cclegacy._RF.push({}, "c87408xiZxNJrUHlKkiZtoS", "settings", undefined);
      function toggle(app, key) {
        if (app.settingsSaving) return;
        app.settingsSaving = key;
        Settings(app);
        var _app$profile$SetSetti = app.profile.SetSetting(key, !app.profile.settings[key]),
          ok = _app$profile$SetSetti[0],
          err = _app$profile$SetSetti[1];
        app.settingsSaving = undefined;
        applySettings(app.profile.settings);
        if (app.screen === 'settings') {
          Settings(app);
          if (!ok) app.Toast(String(err));
        }
      }

      // Row pitch below the two R01 rows (music 202, sound 273 / 70 tall, divider at 270).
      var ROW_PITCH = 71;
      // Action rows: label from the R01 label column, plank right edge just past the toggles', narrowest plank.
      var LABEL_X = 50,
        PLANK_RIGHT = 250,
        PLANK_MIN = 84;
      // Picker planks and the check on the current language.
      var PICK_W = 140,
        PICK_H = 40,
        CHECK = 13,
        PICK_PAD = 5;
      // A language's name is drawn in its own script with the fixed 'names' fonts (ui/kit.ts), whatever the current set.
      var nameFamily = function nameFamily(code) {
        return code === 'ko' ? 'names-ko' : 'names';
      };
      function divider(page, y) {
        for (var i = 0; i < 24; i++) page.AddChild(UI.Panel({
          position: 'absolute',
          left: 58 + i * 10.5,
          top: y,
          width: 6,
          height: 1.5,
          backgroundColor: [196, 160, 118, 200],
          pointerEvents: 'none'
        }));
      }
      function Settings(app) {
        var _base = base(app, 'settings', 'home.r02'),
          page = _base[0];
        // The whole page is washed (205 at the top, 150 below); beside the page the fill gets one 180 wash, with the lower
        // wash repeated beside and below the page as before. Above the page (the tall-screen band) it takes the top's 205;
        // below, the repeated lower wash alone matches the page's 150 (edge 0).
        page.props.fillWash = [255, 240, 215, 180];
        page.props.fillWashEdges = [205, 0];
        page.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 180,
          width: 360,
          height: 460,
          backgroundColor: [255, 240, 215, 150],
          pointerEvents: 'none'
        }));
        page.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 150,
          backgroundColor: [255, 240, 215, 205],
          pointerEvents: 'none'
        }));
        for (var i = 0; i < 30; i++) {
          page.AddChild(UI.Panel({
            position: 'absolute',
            left: 0,
            top: 150 + i,
            width: 360,
            height: 1,
            backgroundColor: [255, 240, 215, Math.floor(205 - 55 * (i + .5) / 30 + .5)],
            pointerEvents: 'none'
          }));
        }
        var extraRows = 1 + (app.privacyRequired ? 1 : 0);
        var rowsEnd = 343 + extraRows * ROW_PITCH;
        var cardH = 218 + extraRows * ROW_PITCH;
        page.AddChild(Image('ui.item_overlay.shell.plain', 36, 170, 288, cardH, [255, 247, 224, 255]));
        page.AddChild(Image('ui.pause.title_plaque', 80, 140, 200, 60));
        var _S$Face = Face('ui.pause.title_plaque', 80, 140, 200, 60),
          tfx = _S$Face[0],
          tfy = _S$Face[1],
          tfw = _S$Face[2],
          tfh = _S$Face[3];
        page.AddChild(Text(L('店铺设置'), 18, tfx, tfy + tfh / 2 - 20, tfw, 40, ink));
        var saving = app.settingsSaving;
        // Row dividers: programmatic dashed lines between the rows.
        divider(page, 270);
        var rows = [{
          key: 'music',
          label: '音乐',
          icon: 'ui.icon.music.r02',
          y: 202,
          h: 65
        }, {
          key: 'sfx',
          label: '音效',
          icon: 'ui.icon.sfx.r02',
          y: 273,
          h: 70
        }];
        app.refs.settingsRows = {};
        var _loop = function _loop() {
          var r = _rows[_i];
          var on = app.profile.settings[r.key];
          var busy = saving === r.key;
          var row = UI.Panel({
            position: 'absolute',
            left: 48,
            top: r.y,
            width: 263,
            height: r.h,
            overflow: 'visible'
          });
          var cy = r.h / 2 - 7;
          row.AddChild(Image(r.icon, 14, cy - 14, 28, 28));
          row.AddChild(Text(L(r.label), 14, 50, cy - 13, 80, 26, ink, 'left'));
          row.AddChild(Image(on ? 'ui.toggle.track.on' : 'ui.toggle.track.off', 188, cy - 15, 60, 29, on ? [120, 170, 90, 255] : [190, 180, 165, 255]));
          row.AddChild(Image('ui.toggle.knob', on ? 222 : 188, cy - 13.5, 26, 26, [250, 236, 210, 255]));
          var state = Text(busy ? L('保存中…') : on ? L('开') : L('关'), 11, 178, cy + 15, 80, 14, busy ? muted : ink);
          row.AddChild(state);
          var button = UI.Button({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 263,
            height: r.h,
            borderRadius: 8,
            disabled: saving !== undefined,
            onClick: function onClick() {
              playCue('sfx.click');
              toggle(app, r.key);
            }
          });
          row.AddChild(button);
          if (saving) row.SetStyle({
            opacity: busy ? 1 : .45
          });
          page.AddChild(row);
          app.refs.settingsRows[r.key] = {
            button: button,
            state: state
          };
        };
        for (var _i = 0, _rows = rows; _i < _rows.length; _i++) {
          _loop();
        }
        // Language and privacy rows: icon, label, and a small plank button on the right; the whole row is the tap target.
        var actionRows = [{
          key: 'language',
          label: L('语言'),
          icon: 'ui.icon.language',
          text: languageName(language()) + ' >',
          family: nameFamily(language()),
          onClick: function onClick() {
            return OpenLanguagePicker(app);
          }
        }];
        if (app.privacyRequired) actionRows.push({
          key: 'privacy',
          label: L('隐私选项'),
          icon: 'ui.icon.privacy',
          text: L('管理'),
          family: 'sans',
          onClick: function onClick() {
            return app.showPrivacy == null ? void 0 : app.showPrivacy();
          }
        });
        actionRows.forEach(function (r, i) {
          // Each plank is as wide as its text needs (the face is 83% of the art, minus the text margins); when label
          // and plank do not both fit, the label gives way down to 88% before the plank does (long privacy labels).
          var room = PLANK_RIGHT - LABEL_X - 12;
          var labelW = textWidth(r.label, 14, 'sans');
          var bw = Math.max(PLANK_MIN, Math.ceil((textWidth(r.text, 13, r.family) + 10) / .834));
          if (labelW + bw > room) bw = Math.max(PLANK_MIN, Math.min(bw, room - labelW * .88));
          var y = 273 + 70 + 1 + i * ROW_PITCH,
            h = 70;
          divider(page, y - 3);
          var row = UI.Panel({
            position: 'absolute',
            left: 48,
            top: y,
            width: 263,
            height: h,
            overflow: 'visible'
          });
          var cy = h / 2 - 7;
          row.AddChild(Image(r.icon, 14, cy - 14, 28, 28));
          row.AddChild(Text(r.label, 14, LABEL_X, cy - 13, room - bw, 26, ink, 'left'));
          row.AddChild(Image('ui.item_overlay.button.secondary', PLANK_RIGHT - bw, cy - 16, bw, 32));
          row.AddChild(FaceText('ui.item_overlay.button.secondary', PLANK_RIGHT - bw, cy - 16, bw, 32, r.text, 13, ink, 'center', r.family, 4));
          var button = UI.Button({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 263,
            height: h,
            borderRadius: 8,
            disabled: saving !== undefined,
            onClick: function onClick() {
              playCue('sfx.click');
              r.onClick();
            }
          });
          row.AddChild(button);
          if (saving) row.SetStyle({
            opacity: .45
          });
          page.AddChild(row);
          app.refs.settingsRows[r.key] = {
            button: button
          };
        });
        var backY = 416 + extraRows * ROW_PITCH;
        var _S$ImageButton = ImageButton('ui.item_overlay.button.secondary', 118, backY, 124, 36, app.Home, {
            pressScale: .96,
            hitPad: 4
          }),
          backRoot = _S$ImageButton[0],
          backFace = _S$ImageButton[2];
        var _S$Face2 = Face('ui.item_overlay.button.secondary', 0, 0, 124, 36, 8),
          fx = _S$Face2[0],
          fy = _S$Face2[1],
          fw = _S$Face2[2],
          fh = _S$Face2[3];
        backFace.AddChild(Row(fx, fy, fw, fh, [{
          icon: 'ui.icon.back.r02',
          size: 16
        }, {
          text: L('返回'),
          size: 15
        }], 4));
        page.AddChild(backRoot);
        app.refs.settingsBack = backRoot;
        // Save failures show inside the booklet's lower margin.
        var message = UI.Label({
          minFontSize: 9,
          position: 'absolute',
          left: 52,
          top: rowsEnd + 1,
          width: 256,
          height: 24,
          text: '',
          fontSize: 12,
          fontColor: warmRed,
          textAlign: 'center',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          fontFamily: 'body',
          opacity: 0,
          pointerEvents: 'none'
        });
        page.AddChild(message);
        app.refs.message = message;
        app.MountPage(page);
        // The privacy status can change after boot (Android: the launch's consent update finishing): ask again on every
        // visit; the answer re-renders the page only when it differs.
        if (app.screen === 'settings') app.checkPrivacy == null || app.checkPrivacy();
      }

      // The language picker over the settings page (screen 'language'): the ten languages in two columns, each in its own
      // script, the current one on the gold primary plank with a check. A choice saves, switches and returns to the
      // settings page in the new language; the back button, a tap outside the sheet or ESC / Android back close it.
      function OpenLanguagePicker(app) {
        Settings(app);
        app.screen = 'language';
        // The page's own Back button would show through the dim beside the sheet's.
        app.refs.settingsBack.SetStyle({
          visible: false
        });
        var close = function close() {
          if (!app.languageSwitching) Settings(app);
        };
        // Taps bubble to ancestors, so the closing backdrop is a sibling under the sheet, not the root: a tap on the
        // sheet's margins or between the planks lands on the sheet and does nothing (the tall-screen blockers find the
        // backdrop as the page's full-size tap target and forward to it).
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640
        });
        root.AddChild(UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          backgroundColor: [47, 32, 20, 150],
          onClick: close
        }));
        root.AddChild(UI.Panel({
          position: 'absolute',
          left: 16,
          top: 170,
          width: 328,
          height: 364,
          onClick: function onClick() {}
        }));
        // The title plaque reaches above the sheet: a tap on it is a tap on the sheet.
        root.AddChild(UI.Panel({
          position: 'absolute',
          left: 80,
          top: 140,
          width: 200,
          height: 30,
          onClick: function onClick() {}
        }));
        root.AddChild(Image('ui.item_overlay.shell.plain', 16, 170, 328, 364, [255, 247, 224, 255]));
        root.AddChild(Image('ui.pause.title_plaque', 80, 140, 200, 60));
        var _S$Face3 = Face('ui.pause.title_plaque', 80, 140, 200, 60),
          tfx = _S$Face3[0],
          tfy = _S$Face3[1],
          tfw = _S$Face3[2],
          tfh = _S$Face3[3];
        root.AddChild(Text(L('语言'), 18, tfx, tfy + tfh / 2 - 20, tfw, 40, ink));
        // "Language" under the plaque, so a player who cannot read the current language still finds the way back.
        if (language() !== 'en') root.AddChild(Text('Language', 14, 16, 203, 328, 20, [86, 56, 32, 255], 'center', 'names'));
        var current = language();
        var buttons = {};
        var roots = [];
        var _S$Face4 = Face('ui.item_overlay.button.secondary', 0, 0, PICK_W, PICK_H, 4),
          faceW = _S$Face4[2],
          faceH = _S$Face4[3];
        var need = function need(code, size) {
          return textWidth(languageName(code), size, nameFamily(code)) + (code === current ? CHECK + 3 : 0);
        };
        var widest = Math.max.apply(Math, PICKER_LANGUAGES.map(function (code) {
          return need(code, 13);
        }));
        var nameSize = Math.max(10, Math.min(13, 13 * (faceW - 2 * PICK_PAD) / widest));
        PICKER_LANGUAGES.forEach(function (code, i) {
          var x = 34 + i % 2 * 152,
            y = 230 + Math.floor(i / 2) * 50;
          var on = code === current;
          var art = on ? 'ui.item_overlay.button.primary' : 'ui.item_overlay.button.secondary';
          var _S$ImageButton2 = ImageButton(art, x, y, PICK_W, PICK_H, function () {
              var _app$chooseLanguage;
              if (app.languageSwitching) return;
              playCue('sfx.click');
              if (on) {
                Settings(app);
                return;
              }
              // Busy: the chosen plank stays, the others and Back dim (as the toggle rows do while saving).
              app.languageSwitching = true;
              for (var _i2 = 0, _roots = roots; _i2 < _roots.length; _i2++) {
                var other = _roots[_i2];
                if (other !== btnRoot) other.SetStyle({
                  opacity: .45
                });
              }
              var done = function done(result) {
                app.languageSwitching = false;
                if (app.screen !== 'language') return;
                Settings(app);
                if (result === 'unsaved') app.Toast('无法保存语言设置');
                if (result === 'failed') app.Toast('无法切换语言，请稍后再试');
              };
              // chooseLanguage resolves 'failed' itself; the second handler only guards against a bug there.
              void ((_app$chooseLanguage = app.chooseLanguage == null ? void 0 : app.chooseLanguage(code)) != null ? _app$chooseLanguage : Promise.resolve('failed')).then(done, function () {
                return done('failed');
              });
            }, {
              pressScale: .96,
              hitPad: 2
            }),
            btnRoot = _S$ImageButton2[0],
            btn = _S$ImageButton2[1],
            face = _S$ImageButton2[2];
          var _S$Face5 = Face('ui.item_overlay.button.secondary', 0, 0, PICK_W, PICK_H, 4),
            fx = _S$Face5[0],
            fy = _S$Face5[1];
          var name = {
            text: languageName(code),
            size: nameSize,
            family: nameFamily(code)
          };
          face.AddChild(Row(fx, fy, faceW, faceH, on ? [{
            icon: 'ui.icon.check',
            size: CHECK
          }, name] : [name], 3));
          root.AddChild(btnRoot);
          buttons[code] = btn;
          roots.push(btnRoot);
        });
        var _S$ImageButton3 = ImageButton('ui.item_overlay.button.secondary', 118, 484, 124, 36, close, {
            pressScale: .96,
            hitPad: 4
          }),
          backRoot = _S$ImageButton3[0],
          backBtn = _S$ImageButton3[1],
          backFace = _S$ImageButton3[2];
        var _S$Face6 = Face('ui.item_overlay.button.secondary', 0, 0, 124, 36, 8),
          fx = _S$Face6[0],
          fy = _S$Face6[1],
          fw = _S$Face6[2],
          fh = _S$Face6[3];
        backFace.AddChild(Row(fx, fy, fw, fh, [{
          icon: 'ui.icon.back.r02',
          size: 16
        }, {
          text: L('返回'),
          size: 15
        }], 4));
        root.AddChild(backRoot);
        roots.push(backRoot);
        app.page.AddChild(root);
        root.Animate({
          keyframes: {
            0: {
              opacity: 0
            },
            1: {
              opacity: 1
            }
          },
          duration: .18,
          fillMode: 'both',
          easing: 'easeOut'
        });
        app.refs.languagePicker = {
          root: root,
          buttons: buttons,
          back: backBtn
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/skillItemVfx.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './vfxState.ts', './widgets.ts', './assets.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, PawRoute, Merge, CellScale, TargetKey, Breath, Representatives, PawSprites, PawPoint, Sketch, resolveAsset;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      PawRoute = module.PawRoute;
      Merge = module.Merge;
      CellScale = module.CellScale;
      TargetKey = module.TargetKey;
      Breath = module.Breath;
      Representatives = module.Representatives;
      PawSprites = module.PawSprites;
      PawPoint = module.PawPoint;
    }, function (module) {
      Sketch = module.Sketch;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }],
    execute: function () {
      exports({
        Build: Build,
        Cell: Cell,
        Items: Items,
        PawGeometry: PawGeometry,
        Rainbow: Rainbow,
        Skill: Skill,
        Update: Update
      });
      cclegacy._RF.push({}, "5a5caMnpWZGN6FFqUE/o6H3", "skillItemVfx", undefined);
      var IDS = ['fx.paw_trail.r02', 'fx.target_ring.r02', 'fx.star', 'fx.glow', 'ui.tips.glow_frame'];
      function add(app, b) {
        var _b$delay;
        var g = app.g;
        // A cat's batch starts at its release frame (b.delay); it is not drawn before then.
        var batch = b;
        batch.at = g.vfxTime + ((_b$delay = b.delay) != null ? _b$delay : 0);
        batch.seen = {};
        var incoming = b.targets;
        batch.targets = [];
        for (var _iterator = _createForOfIteratorHelperLoose(incoming), _step; !(_step = _iterator()).done;) {
          var p = _step.value;
          batch.seen[TargetKey(p)] = true;
          batch.targets.push(p);
        }
        // Repeated delivery in the same frame/source/wave joins the active batch.
        for (var _iterator2 = _createForOfIteratorHelperLoose(g.vfxBatches), _step2; !(_step2 = _iterator2()).done;) {
          var old = _step2.value;
          if (old.kind === batch.kind && old.origin === batch.origin && old.wave === batch.wave && old.at === batch.at) {
            for (var _iterator3 = _createForOfIteratorHelperLoose(batch.targets), _step3; !(_step3 = _iterator3()).done;) {
              var _p = _step3.value;
              var k = TargetKey(_p);
              if (!old.seen[k]) {
                old.seen[k] = true;
                old.targets.push(_p);
                old.representatives = undefined;
              }
            }
            return old;
          }
        }
        g.vfxBatches.push(batch);
        console.log("[VFX] " + batch.kind + " source=" + batch.origin + " targets=" + batch.targets.length);
        return batch;
      }
      var rect = function rect(app, w) {
        return w.RectIn(app.page);
      };
      function badge(app, id) {
        for (var _iterator4 = _createForOfIteratorHelperLoose(app.g.play.catStates), _step4; !(_step4 = _iterator4()).done;) {
          var v = _step4.value;
          if (v.cat && v.cat.id === id) {
            var b = rect(app, v.charge.root);
            return [b.x + b.w / 2, b.y + b.h / 2, v];
          }
        }
        return undefined;
      }
      function target(app, p) {
        var refs = app.g.play;
        if (p.r !== undefined) {
          var b = rect(app, refs.board);
          return [b.x + (p.c - .5) * b.w / 7, b.y + (p.r - .5) * b.h / 7];
        }
        if (p.cat) return badge(app, p.cat);
        if (p.hud === 'timer') {
          var _b = rect(app, refs.timeGainChip);
          return [_b.x + _b.w + 34, _b.y + _b.h / 2];
        }
        return undefined;
      }
      function PawGeometry(app, origin, p) {
        var src = badge(app, origin);
        if (!src) throw new Error('missing paw source cat');
        var t = target(app, p);
        if (!t) throw new Error('missing paw target');
        var destination = {
          x: t[0],
          y: t[1],
          kind: 'cell',
          cellSize: app.g.cellSize
        };
        if (p.cat) {
          destination.kind = 'cat';
          destination.name = rect(app, t[2].name);
        } else if (p.hud) destination.kind = 'timer';
        return PawRoute({
          x: src[0],
          y: src[1],
          rect: rect(app, src[2].charge.root)
        }, destination, {
          tag: rect(app, app.g.play.timeGainChip)
        });
      }
      var paths = {};
      // One UI-owned layer over the page.
      function Build(app) {
        var g = app.g;
        g.vfxTime = 0;
        g.vfxBatches = [];
        g.vfxSlotWaves = {};
        g.cellVfx = {};
        paths = {};
        for (var _iterator5 = _createForOfIteratorHelperLoose(IDS), _step5; !(_step5 = _iterator5()).done;) {
          var id = _step5.value;
          var a = resolveAsset(id);
          if (!a) throw new Error('missing accepted VFX ' + id);
          paths[id] = a.path;
        }
        var layer = new Sketch({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          pointerEvents: 'none'
        });
        g.play.vfxLayer = layer;
        app.page.AddChild(layer);
      }
      function draw(app) {
        var _g$play;
        var g = app.g,
          layer = (_g$play = g.play) == null ? void 0 : _g$play.vfxLayer;
        if (!layer || !layer.node.isValid) return;
        layer.Begin();
        var art = function art(id, x, y, w, h, alpha, angle, tint) {
          if (alpha <= 0 || x + w / 2 < 0 || x - w / 2 > 360 || y + h / 2 < 0 || y - h / 2 > 640) return;
          layer.Image(paths[id], x, y, w, h, alpha, angle != null ? angle : 0, tint);
        };
        var stars = function stars(x, y, t, count, radius) {
          if (t < 0 || t > 1) return;
          for (var i = 1; i <= count; i++) {
            var a = i * 2 * Math.PI / count;
            art('fx.star', x + Math.cos(a) * (5 + radius * t), y + Math.sin(a) * (5 + radius * t), 9, 9, Math.sin(Math.PI * t), a + t);
          }
        };
        var light = function light(x, y, tx, ty, t, width) {
          if (t < 0 || t > .28) return;
          var u = Math.min(1, t / .2),
            a = t <= .2 ? 1 : 1 - (t - .2) / .08;
          // Rise out of the owning slot before fanning across the board.
          var point = function point(v) {
            return [x + (tx - x) * v * v, y + (ty - y) * (2 * v - v * v)];
          };
          var pts = [[x, y]];
          for (var step = 1; step <= 20; step++) pts.push(point(u * step / 20));
          // Three strokes (concept A): white glow, dark-brown outline, orange-red line, white core.
          for (var _i = 0, _arr = [[width + 5, [255, 255, 255], 110], [width + 2, [112, 72, 42], 255], [width, [242, 85, 44], 255], [width * .32, [255, 248, 236], 255]]; _i < _arr.length; _i++) {
            var _arr$_i = _arr[_i],
              w = _arr$_i[0],
              c = _arr$_i[1],
              al = _arr$_i[2];
            layer.Stroke(pts, w, [c[0], c[1], c[2], al * a]);
          }
          var _point = point(u),
            hx = _point[0],
            hy = _point[1];
          art('fx.glow', hx, hy, 21, 21, a, undefined, [255, 140, 90, 255]);
          layer.Circle(hx, hy, 3.1, [255, 248, 236, 255 * a], true);
        };
        var run = function run(pawPass) {
          var paws = [],
            dots = [];
          var _loop = function _loop() {
            var b = _step6.value;
            var age = g.vfxTime - b.at;
            if (age < 0) return 1; // continue
            var x = b.x,
              y = b.y;
            if (!b.representatives) {
              var points = b.targets.map(function (p) {
                var t = target(app, p);
                return {
                  x: t ? t[0] : 0,
                  y: t ? t[1] : 0
                };
              });
              b.representatives = Representatives(points, x, y, 8);
            }
            var reps = b.representatives;
            if (b.kind === 'skill') {
              b.targets.forEach(function (p0, index) {
                var _b$routes;
                var p = p0;
                var t = target(app, p);
                if (!t) return;
                var tx = t[0],
                  ty = t[1];
                b.routes = (_b$routes = b.routes) != null ? _b$routes : [];
                if (!b.routes[index]) b.routes[index] = PawGeometry(app, b.origin, p);
                var route = b.routes[index];
                if (pawPass && reps.has(index) && age <= .38) {
                  var _loop2 = function _loop2() {
                      var fraction = step / 70;
                      if (fraction > Math.min(1, age / .35)) return 0; // continue
                      var _V$PawPoint = PawPoint(route, fraction),
                        px = _V$PawPoint[0],
                        py = _V$PawPoint[1];
                      if (dots.some(function (q) {
                        return Math.pow(px - q[0], 2) + Math.pow(py - q[1], 2) < 16;
                      })) return 0; // continue
                      dots.push([px, py]);
                      layer.Circle(px, py, 1.6, [242, 85, 44, 220 * Math.min(1, (.38 - age) / .08)]);
                    },
                    _ret;
                  // Small warm dots bridge the footprints; shared stems are drawn once.
                  for (var step = 0; step <= 70; step++) {
                    _ret = _loop2();
                    if (_ret === 0) continue;
                  }
                  var _loop3 = function _loop3() {
                    var _paw$alpha;
                    var paw = _step7.value;
                    if (paws.some(function (q) {
                      return q[2] !== index && Math.pow(paw.x - q[0], 2) + Math.pow(paw.y - q[1], 2) < Math.pow(paw.size * 1.2, 2);
                    })) return 1; // continue
                    paws.push([paw.x, paw.y, index]);
                    art('fx.paw_trail.r02', paw.x, paw.y, paw.size, paw.size, (_paw$alpha = paw.alpha) != null ? _paw$alpha : 1, paw.angle);
                  };
                  for (var _iterator7 = _createForOfIteratorHelperLoose(PawSprites(route, age)), _step7; !(_step7 = _iterator7()).done;) {
                    if (_loop3()) continue;
                  }
                }
                if (p.hud) {
                  tx = route.finish.x;
                  ty = route.finish.y;
                }
                var tt = age - .35;
                if (!pawPass && tt >= 0 && tt <= .25) {
                  var scale = .8 + .2 * Math.min(1, tt / .08),
                    alpha = tt <= .2 ? 1 : 1 - (tt - .2) / .05;
                  if (p.hud) {
                    art('fx.target_ring.r02', tx, ty, 22 * scale, 22 * scale, alpha);
                    stars(tx, ty, tt / .25, 3, 6);
                  } else {
                    var w = p.cat ? 64 : g.cellSize * 1.7;
                    art('fx.target_ring.r02', tx, ty, w * scale, w * scale, alpha);
                    if (reps.has(index)) stars(tx, ty, tt / .25, 4, g.cellSize * .38);
                  }
                }
              });
            } else if (!pawPass && b.kind === 'item') {
              // The slot frame stays wholly on the page.
              if (b.slotFlash && age <= .25) art('ui.tips.glow_frame', x, Math.min(y, 640 - 29 - 1), 58, 56, Math.sin(Math.PI * age / .25), undefined, [242, 85, 44, 255]);
              b.targets.forEach(function (p0, index) {
                var p = p0;
                var t = target(app, p);
                if (!t) return;
                var tx = t[0],
                  ty = t[1];
                if (reps.has(index)) {
                  light(x, y, tx, ty, age, 5);
                  stars(tx, ty, (age - .32) / .24, 4, g.cellSize * .4);
                }
                if (age >= .18 && age <= .44) art('fx.target_ring.r02', tx, ty, g.cellSize * 1.25, g.cellSize * 1.25, Math.min(1, (age - .18) / .02, (.44 - age) / .08));
                if (p.flip && age >= .2 && age <= .45) {
                  // A thin light sweeping across the flipping cell (Maker draws gradients; a soft bar here).
                  var u = (age - .2) / .25,
                    size = g.cellSize,
                    glow = Math.sin(Math.PI * u);
                  var sx = tx - size * .5 + u * size;
                  layer.Stroke([[sx + Math.sin(.22) * size * .5, ty - size * .4], [sx - Math.sin(.22) * size * .5, ty + size * .4]], size * .2, [255, 224, 129, 120 * glow]);
                  layer.Stroke([[sx + Math.sin(.22) * size * .5, ty - size * .4], [sx - Math.sin(.22) * size * .5, ty + size * .4]], 2.4, [255, 243, 193, 250 * glow]);
                }
              });
            } else if (!pawPass && b.kind === 'rainbow') {
              b.targets.forEach(function (p0, index) {
                var t = target(app, p0);
                if (!t) return;
                var tx = t[0],
                  ty = t[1];
                if (reps.has(index)) {
                  light(x, y, tx, ty, age, 4.8);
                  stars(tx, ty, (age - .16) / .28, 3, g.cellSize * .32);
                }
                if (age >= .18 && age <= .44) art('fx.target_ring.r02', tx, ty, g.cellSize * 1.25, g.cellSize * 1.25, Math.min(1, (age - .18) / .02, (.44 - age) / .08));
              });
            } else if (!pawPass && b.kind === 'charge') stars(x, y, age / .18, 4, 25);
          };
          for (var _iterator6 = _createForOfIteratorHelperLoose(g.vfxBatches), _step6; !(_step6 = _iterator6()).done;) {
            if (_loop()) continue;
          }
        };
        // Item lights and rings first, paws over them; both use the whole page.
        run(false);
        run(true);
        layer.End();
      }

      // delay: seconds until the cat's release frame. The full gold ring stays lit through the wind-up and flashes at
      // release, when the paw trail sets off.
      function Skill(app, e, delayIn) {
        var _e$targets;
        var src = badge(app, e.id);
        if (!src) return;
        var x = src[0],
          y = src[1],
          state = src[2];
        var delay = Math.max(0, delayIn != null ? delayIn : 0);
        add(app, {
          kind: 'charge',
          origin: e.id,
          x: x,
          y: y,
          targets: [],
          delay: delay
        });
        add(app, {
          kind: 'skill',
          origin: e.id,
          x: x,
          y: y,
          targets: (_e$targets = e.targets) != null ? _e$targets : [],
          delay: delay
        });
        if (delay > 0) state.releaseAt = app.g.vfxTime + delay;else {
          state.releaseAt = undefined;
          state.charge.Fire();
          state.fireAt = app.g.vfxTime;
        }
      }
      function Items(app, events) {
        var g = app.g;
        for (var _iterator8 = _createForOfIteratorHelperLoose(Merge(events)), _step8; !(_step8 = _iterator8()).done;) {
          var _b$slot;
          var b = _step8.value;
          var button = g.play.itemButtons[((_b$slot = b.slot) != null ? _b$slot : 0) - 1];
          if (!button) continue;
          var waveKey = b.origin + ":" + b.wave;
          var flash = !g.vfxSlotWaves[waveKey];
          g.vfxSlotWaves[waveKey] = true;
          // Keep only the current wave for this source.
          if (flash) for (var _i2 = 0, _Object$keys = Object.keys(g.vfxSlotWaves); _i2 < _Object$keys.length; _i2++) {
            var k = _Object$keys[_i2];
            if (k !== waveKey && k.startsWith(b.origin + ':')) delete g.vfxSlotWaves[k];
          }
          var p = rect(app, button);
          add(app, {
            kind: 'item',
            origin: b.origin,
            wave: b.wave,
            targets: b.targets,
            x: p.x + p.w / 2,
            y: p.y + p.h / 2,
            slotFlash: flash
          });
        }
      }
      function Rainbow(app, e) {
        var _loop4 = function _loop4() {
            var fx = _arr2[_i3];
            if (fx.kind !== 'rainbow') return 0; // continue
            var targets = e.cells.filter(function (p) {
              return p.cell.kind === fx.targetKind;
            }).map(function (p) {
              return {
                r: p.r,
                c: p.c
              };
            });
            var t = target(app, fx);
            if (!t) return 0; // continue
            add(app, {
              kind: 'rainbow',
              origin: fx.r + ":" + fx.c,
              x: t[0],
              y: t[1],
              targets: targets
            });
          },
          _ret2;
        for (var _i3 = 0, _arr2 = (_e$specials = e.specials) != null ? _e$specials : []; _i3 < _arr2.length; _i3++) {
          var _e$specials;
          _ret2 = _loop4();
          if (_ret2 === 0) continue;
        }
      }
      // The cell's art flips (or pops) in place; the new art shows halfway through.
      function Cell(app, p, delay) {
        if (delay === void 0) {
          delay = 0;
        }
        var g = app.g;
        app.SetCellArt(p.r, p.c, p.before);
        g.cellVfx[p.r * 8 + p.c] = {
          at: g.vfxTime + delay,
          after: p.after,
          flip: p.flip,
          r: p.r,
          c: p.c,
          changed: false
        };
      }
      function Update(app, dt) {
        var g = app.g;
        g.vfxTime += dt;
        g.vfxBatches = g.vfxBatches.filter(function (b) {
          return g.vfxTime - b.at < .6;
        });
        for (var _i4 = 0, _Object$keys2 = Object.keys(g.cellVfx); _i4 < _Object$keys2.length; _i4++) {
          var _g$tiles$b$r;
          var key = _Object$keys2[_i4];
          var b = g.cellVfx[Number(key)];
          var t = g.vfxTime - b.at;
          var tile = (_g$tiles$b$r = g.tiles[b.r]) == null ? void 0 : _g$tiles$b$r[b.c];
          if (!b.changed && t >= (b.flip ? .125 : .12)) {
            app.SetCellArt(b.r, b.c, b.after);
            b.changed = true;
          }
          if (t >= (b.flip ? .25 : .24)) {
            delete g.cellVfx[Number(key)];
            tile == null || tile.art.SetStyle({
              scaleX: 1,
              scaleY: 1
            });
          } else if (tile && t >= 0) {
            var _V$CellScale = CellScale(t, b.flip),
              sx = _V$CellScale[0],
              sy = _V$CellScale[1];
            tile.art.SetStyle({
              scaleX: Math.max(.001, sx),
              scaleY: sy
            });
          }
        }
        var _loop5 = function _loop5() {
          var v = _step9.value;
          if (v.releaseAt !== undefined && g.vfxTime + 1e-7 >= v.releaseAt) {
            v.releaseAt = undefined;
            v.charge.Fire();
            v.fireAt = g.vfxTime;
          }
          v.charge.Step(dt);
          var _V$Breath = Breath(g.vfxTime),
            alpha = _V$Breath[0],
            scale = _V$Breath[1];
          if (v.fireAt !== undefined) {
            var _t = (g.vfxTime - v.fireAt) / .18;
            if (_t >= 1) {
              v.fireAt = undefined;
              alpha = 0;
              scale = 1;
            } else {
              alpha = 1 - _t;
              scale = 1 + .15 * _t;
            }
          } else if (!v.charge.state.full) {
            alpha = 0;
            scale = 1;
          }
          v.fullRing.SetStyle({
            opacity: alpha,
            scale: scale
          });
          v.sparkles.forEach(function (star, i) {
            return star.SetStyle({
              opacity: v.fireAt === undefined && v.charge.state.full ? .25 + .75 * (1 - Math.cos(g.vfxTime * 2 * Math.PI / 1.2 + (i + 1) * 2)) / 2 : 0
            });
          });
        };
        for (var _iterator9 = _createForOfIteratorHelperLoose(g.play.catStates), _step9; !(_step9 = _iterator9()).done;) {
          _loop5();
        }
        draw(app);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/skin.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts', './assets.ts', './text.ts', './audio.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, UI, PT, LINE_EM, resolveAsset, textWidth, blockLines, playCue;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      UI = module.UI;
      PT = module.PT;
      LINE_EM = module.LINE_EM;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      textWidth = module.textWidth;
      blockLines = module.blockLines;
      var _setter = {};
      _setter.Number = module.formatNumber;
      _setter.fitSize = module.fitSize;
      _setter.fitText = module.fitText;
      _setter.phraseLines = module.phraseLines;
      _setter.textWidth = module.textWidth;
      _setter.wrap = module.wrap;
      exports(_setter);
    }, function (module) {
      playCue = module.playCue;
    }],
    execute: function () {
      exports({
        Block: Block,
        Face: Face,
        FaceText: FaceText,
        FitWidth: FitWidth,
        Image: Image,
        ImageButton: ImageButton,
        Row: Row,
        SetDisabled: SetDisabled,
        Text: Text,
        TwoLines: TwoLines
      });
      cclegacy._RF.push({}, "056c4ilmlJBQ7jVVp1+mJu3", "skin", undefined);
      var ink = exports('ink', [92, 58, 30, 255]);
      var cream = exports('cream', [255, 246, 226, 255]);
      var muted = exports('muted', [132, 108, 86, 255]);
      var warmRed = exports('warmRed', [196, 72, 52, 255]);

      // Absolute image panel; falls back to a flat colour block if the asset is missing.
      function Image(id, x, y, w, h, fallback) {
        var asset = resolveAsset(id);
        return UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          pointerEvents: 'none',
          backgroundImage: asset ? asset.path : null,
          backgroundFit: 'fill',
          backgroundColor: asset ? [0, 0, 0, 0] : fallback != null ? fallback : [214, 176, 120, 255],
          borderRadius: asset ? 0 : 8
        });
      }
      function Text(value, size, x, y, w, h, color, align, family) {
        return UI.Label({
          minFontSize: 9,
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          text: value.split('​').join(''),
          fontSize: size,
          fontColor: color != null ? color : ink,
          textAlign: align != null ? align : 'center',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          fontFamily: family != null ? family : 'sans',
          pointerEvents: 'none'
        });
      }

      // Image button: the art is the button; pressing scales the face (pressScale) and dims it slightly.
      // Returns [root, button, face]; children go into face.
      function ImageButton(id, x, y, w, h, _onClick, opts) {
        var _opts$hitPad, _opts$pressScale;
        if (opts === void 0) {
          opts = {};
        }
        var face = Image(id, 0, 0, w, h, opts.fallback);
        var root = UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          overflow: 'visible'
        });
        var hitPad = (_opts$hitPad = opts.hitPad) != null ? _opts$hitPad : 0;
        var button = UI.Button({
          position: 'absolute',
          left: -hitPad,
          top: -hitPad,
          width: w + hitPad * 2,
          height: h + hitPad * 2,
          disabled: opts.disabled,
          onClick: function onClick() {
            playCue('sfx.click');
            _onClick();
          }
        });
        var scale = (_opts$pressScale = opts.pressScale) != null ? _opts$pressScale : .96;
        button.onPointerDown = function () {
          if (!button.props.disabled) face.SetStyle({
            scale: scale,
            opacity: .9
          });
        };
        button.onPointerUp = function () {
          return face.SetStyle({
            scale: 1,
            opacity: 1
          });
        };
        button.onPointerCancel = function () {
          return face.SetStyle({
            scale: 1,
            opacity: 1
          });
        };
        root.AddChild(face);
        root.AddChild(button);
        if (opts.disabled) face.SetStyle({
          opacity: .55
        });
        return [root, button, face];
      }
      function SetDisabled(button, face, disabled) {
        button.SetDisabled(disabled);
        face.SetStyle({
          opacity: disabled ? .55 : 1,
          scale: 1
        });
      }

      // Usable face of an image placed at x,y,w,h (catalog safeArea), shrunk by margin horizontally. Returns [x, y, w, h].
      function Face(id, x, y, w, h, margin) {
        var _resolveAsset$safeAre, _resolveAsset;
        if (margin === void 0) {
          margin = 6;
        }
        var sa = (_resolveAsset$safeAre = (_resolveAsset = resolveAsset(id)) == null ? void 0 : _resolveAsset.safeArea) != null ? _resolveAsset$safeAre : [0, 0, 0, 0];
        var fx = x + sa[0] * w,
          fy = y + sa[1] * h;
        var fw = w * (1 - sa[0] - sa[2]),
          fh = h * (1 - sa[1] - sa[3]);
        return [fx + margin, fy, Math.max(1, fw - 2 * margin), Math.max(1, fh)];
      }
      function FaceText(id, x, y, w, h, value, size, color, align, family, margin) {
        var _Face = Face(id, x, y, w, h, margin),
          fx = _Face[0],
          fy = _Face[1],
          fw = _Face[2],
          fh = _Face[3];
        return Text(value, size, fx, fy, fw, fh, color, align, family);
      }
      // A centred row of icons and texts; if wider than w every text shrinks by the same factor, never below 9 pt.
      function Row(x, y, w, h, items, gap) {
        if (gap === void 0) {
          gap = 4;
        }
        var root = UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          pointerEvents: 'none',
          overflow: 'visible'
        });
        var total = function total(k) {
          var sum = gap * (items.length - 1);
          for (var _iterator = _createForOfIteratorHelperLoose(items), _step; !(_step = _iterator()).done;) {
            var _it$family;
            var it = _step.value;
            sum += 'icon' in it ? it.size : textWidth(it.text, Math.max(9, it.size * k), (_it$family = it.family) != null ? _it$family : 'sans');
          }
          return sum;
        };
        var k = 1;
        for (var i = 0; i < 12; i++) {
          if (total(k) <= w || k <= 0) break;
          k = k * Math.max(.85, w / total(k));
        }
        var cx = (w - total(k)) / 2;
        for (var _iterator2 = _createForOfIteratorHelperLoose(items), _step2; !(_step2 = _iterator2()).done;) {
          var it = _step2.value;
          if ('icon' in it) {
            root.AddChild(Image(it.icon, cx, (h - it.size) / 2, it.size, it.size));
            cx += it.size + gap;
          } else {
            var _it$family2;
            var size = Math.max(9, it.size * k);
            var tw = textWidth(it.text, size, (_it$family2 = it.family) != null ? _it$family2 : 'sans');
            root.AddChild(Text(it.text, size, cx, 0, tw + 1, h, it.color, 'left', it.family));
            cx += tw + gap;
          }
        }
        return root;
      }

      // A multi-line text block: one single-line label per S.Wrap line. Returns [label, height, lineCount].
      function Block(text, size, x, y, width, color, family, align, lineHeight, maxLines, minSize, wrapWidth) {
        if (family === void 0) {
          family = 'body';
        }
        if (align === void 0) {
          align = 'left';
        }
        if (lineHeight === void 0) {
          lineHeight = 1.35;
        }
        var r = blockLines(text, size, family, width, maxLines, minSize != null ? minSize : 9, wrapWidth);
        var px = r.size * PT;
        var h = (r.lines.length * lineHeight + .6) * px;
        var label = UI.Panel({
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: h,
          pointerEvents: 'none',
          overflow: 'visible'
        });
        r.lines.forEach(function (line, k) {
          return label.AddChild(Text(line, r.size, 0, k * lineHeight * px + .3 * px, width, lineHeight * px, color, align, family));
        });
        return [label, h, r.lines.length];
      }

      // Drawn width of a single-line label w x h after the urhox auto-fit (S.FitWidth / UI.MeasureTextFit): the size steps
      // down by .25 until the text fits the width and its line box the height, never below 9 pt.
      function FitWidth(text, size, family, w, h) {
        var pt = size;
        var fits = function fits(q) {
          return textWidth(text, q, family) <= w + .25 && q * PT * LINE_EM <= h + .25;
        };
        while (pt > 9 && !fits(pt)) pt = Math.max(9, pt - .25);
        return textWidth(text, pt, family);
      }

      // Two lines of about equal width for a short caption that does not fit one (English, Japanese). Breaks at spaces when
      // there are any, and after the hyphen of a CJK-free compound (Spezial-|Teile); otherwise between characters, but never inside a katakana word or before ー, small kana or closing
      // punctuation (Japanese line-start rules).
      var NO_LINE_START = 'ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ、。，．・：；！？）」』】〉》';
      var isKatakana = function isKatakana(c) {
        return /[\u30a0-\u30ff]/.test(c);
      };
      var isKanji = function isKanji(c) {
        return /[\u4e00-\u9fff]/.test(c);
      };
      var isHiragana = function isHiragana(c) {
        return /[\u3040-\u309f]/.test(c);
      };
      function TwoLines(text, size, family) {
        var ch = Array.from(text);
        var best = [text, ''],
          score = Infinity;
        var spaced = text.includes(' ') || text.includes('-') && !/[⺀-鿿豈-﫿＀-￯]/.test(text);
        for (var i = 1; i < ch.length; i++) {
          // Not inside a katakana word, nor between a kanji and the hiragana that follows it (okurigana: 引|き直し).
          if (spaced ? ch[i - 1] !== ' ' && ch[i - 1] !== '-' : NO_LINE_START.includes(ch[i]) || isKatakana(ch[i - 1]) && isKatakana(ch[i]) || isKanji(ch[i - 1]) && isHiragana(ch[i])) continue;
          var a = ch.slice(0, i).join('').trim(),
            b = ch.slice(i).join('').trim();
          // Japanese reads best broken after a particle (広告で|引き直し): such a break counts as better balanced.
          var particle = !spaced && 'でをにはがのとへもや'.includes(ch[i - 1]) && !isHiragana(ch[i]);
          var d = Math.abs(textWidth(a, size, family) - textWidth(b, size, family)) - (particle ? textWidth(text, size, family) * .25 : 0);
          if (a && b && d < score) {
            best = [a, b];
            score = d;
          }
        }
        return best;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/text.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './i18n.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, usesMyriad, L, numberSeparators;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      usesMyriad = module.usesMyriad;
      L = module.L;
      numberSeparators = module.numberSeparators;
    }],
    execute: function () {
      exports({
        blockLines: blockLines,
        fitSize: fitSize,
        fitText: fitText,
        formatNumber: formatNumber,
        phraseLines: phraseLines,
        setMeasure: setMeasure,
        textWidth: textWidth,
        wrap: wrap
      });
      cclegacy._RF.push({}, "90258RntrNK1qob8zsOTgJn", "text", undefined);

      // Width in design units of `text` at `size` pt in `family` (U+200B already removed).

      var ZW = '​';
      var chars = function chars(t) {
        return Array.from(t);
      };
      var len = function len(t) {
        return Array.from(t).length;
      };
      var measureImpl = function measureImpl() {
        throw new Error('text.setMeasure() not called');
      };
      function setMeasure(m) {
        measureImpl = m;
      }
      // U+200B (word-boundary marker, never drawn) measures as a missing glyph; strip it first (Skin.lua textWidth).
      function textWidth(text, size, family) {
        if (family === void 0) {
          family = 'sans';
        }
        return measureImpl(text.includes(ZW) ? text.split(ZW).join('') : text, size, family);
      }
      var BREAK_AFTER = new Set(chars(' ，。、；：！？）】,.;:!?'));
      var MEASURE = new Set(['枚', '件', '个', '种']);
      var CN_NUM = new Set(chars('一二两三四五六七八九十几每'));
      var CN_MEASURE = new Set(chars('件个枚种位点次排张只倍局单行列秒'));
      var OPEN_BEFORE = new Set(chars('（(“《【'));
      var NO_SPLIT = exports('NO_SPLIT', ['包装炸弹', '心愿清单', '直线块', '线消', '能量', '偏好品', '变成', '一次', '两次', '炸弹', '商品', '订单', '交单', '加时', '充能', '引爆', '消除', '额外', '搭档', '两行', '两列', '一行', '一列', '范围', '爆炸', '补货', '再送', '翻倍', '分数', '连消', '上场', '独自', '四个', '营业时间', '道具', '引发', '连出', '一排', '所在', '好几枚', '摸一摸', '顾客', '积分', '谢礼', '亲密等级', '毛线团', '特殊块', '当前', '养猫积分', '给人', '接连', '得分', '这一点', '各攒', '下一位', '下一单', '下一个']);

      // Lua pattern classes are ASCII only.
      var isDigit = function isDigit(c) {
        return !!c && c >= '0' && c <= '9';
      };
      var isAlpha = function isAlpha(c) {
        return !!c && /^[A-Za-z]$/.test(c);
      };
      // Text with no Chinese or Japanese in it (English and the other port languages) breaks only at spaces: the Lua rules
      // that keep numbers with their measure words and pull single characters across lines are for Chinese and would cut
      // words ("m / ore", "settlin / g up"). Text with CJK in it keeps the Lua behaviour exactly.
      var spacedText = function spacedText(t) {
        return !/[⺀-鿿豈-﫿＀-￯]/.test(t);
      };
      var isAscii = function isAscii(c) {
        return c.length === 1 && c.charCodeAt(0) <= 127;
      };
      var isNumChar = function isNumChar(c) {
        return /^[0-9%.,]$/.test(c) || c === '×';
      };
      var asciiish = function asciiish(c) {
        return !!c && (/^[A-Za-z0-9%.+-]$/.test(c) || c === '×');
      };
      var trimEnd = function trimEnd(t) {
        return t.replace(/[ \t\n\v\f\r]+$/, '');
      };
      var trimStart = function trimStart(t) {
        return t.replace(/^[ \t\n\v\f\r]+/, '');
      };
      var trim = function trim(t) {
        return trimEnd(trimStart(t));
      };
      var utf8Len = function utf8Len(t) {
        return new TextEncoder().encode(t).length;
      };

      // Wrap text into lines that fit width at size. See Skin.lua S.Wrap for the reasoning behind every rule.
      function wrap(text, size, family, width) {
        var tw = function tw(t) {
          return textWidth(t, size, family);
        };
        var lines = [];
        var paraEnd = {};
        var spaced = spacedText(text);
        var _loop = function _loop() {
          var para = _step.value;
          var ch = chars(para);
          var at = function at(k) {
            return ch[k - 1];
          };
          var breakable = function breakable(k) {
            var c = at(k);
            if (c === ZW) return true;
            // Spaced text breaks at spaces only ("2.º", "Nv.5", "l'objet" stay whole), and a number keeps a short unit
            // after it ("70 s", "70 с.", "3 шт.").
            if (spaced) {
              if (c !== ' ' || at(k + 1) !== undefined && BREAK_AFTER.has(at(k + 1)) && at(k + 1) !== ' ') return false;
              if (k > 1 && isDigit(at(k - 1))) {
                var _n5 = 0;
                while (at(k + 1 + _n5) !== undefined && at(k + 1 + _n5) !== ' ') _n5++;
                if (_n5 <= 3) return false;
              }
              return true;
            }
            if ((c === '.' || c === ',') && k > 1 && isDigit(at(k - 1)) && at(k + 1) !== undefined && isDigit(at(k + 1))) return false;
            if (!spaced && c === ' ' && k > 1 && isDigit(at(k - 1))) return false;
            if (!spaced && c === ' ' && at(k + 1) !== undefined && isDigit(at(k + 1))) return false;
            if (at(k + 1) !== undefined && at(k + 1) !== ' ' && BREAK_AFTER.has(at(k + 1))) return false;
            return c !== undefined && BREAK_AFTER.has(c);
          };
          var inside = {};
          for (var _iterator3 = _createForOfIteratorHelperLoose(NO_SPLIT), _step3; !(_step3 = _iterator3()).done;) {
            var word = _step3.value;
            var w = chars(word);
            for (var _k4 = 1; _k4 <= ch.length - w.length + 1; _k4++) {
              var hit = true;
              for (var j = 1; j <= w.length; j++) if (at(_k4 + j - 1) !== w[j - 1]) {
                hit = false;
                break;
              }
              if (hit) for (var _j = _k4; _j <= _k4 + w.length - 2; _j++) inside[_j] = true;
            }
          }
          var softGlue = true;
          var glued = function glued(k) {
            var a = at(k),
              b = at(k + 1);
            if (b === undefined) return false;
            if (inside[k] || OPEN_BEFORE.has(a)) return true;
            if (CN_NUM.has(a) && CN_MEASURE.has(b)) return true;
            var c = at(k + 2);
            if (softGlue && c !== undefined && c !== ' ' && BREAK_AFTER.has(c) && b !== ' ' && !BREAK_AFTER.has(b)) return true;
            if (softGlue && MEASURE.has(a) && b !== ' ' && !BREAK_AFTER.has(b)) return true;
            if (isNumChar(a) && isNumChar(b)) return true;
            if (isDigit(a) && b === ' ') return true;
            if (a === ' ' && k > 1 && isDigit(at(k - 1))) return true;
            return b !== ' ' && BREAK_AFTER.has(b);
          };
          var line = '',
            lastBreak = 0;
          var i = 1;
          var _loop2 = function _loop2() {
            var trial = line + ch[i - 1];
            if (line !== '' && tw(trial) > width) {
              var _n6 = len(line);
              var okBreak = false;
              if (lastBreak > 0) {
                var _lc;
                var lc = chars(line);
                var head = lc.slice(0, lastBreak).join('');
                var _lastChar = (_lc = lc[lastBreak - 1]) != null ? _lc : '';
                okBreak = spaced || _lastChar === ZW || _lastChar === ' ' && lastBreak >= _n6 * .45 || tw(head) >= width * .6;
              }
              var inWord = spaced ? at(i - 1) !== undefined && at(i) !== undefined && at(i - 1) !== ' ' && at(i) !== ' ' : at(i - 1) !== undefined && at(i) !== undefined && isAlpha(at(i - 1)) && isAlpha(at(i));
              if (!okBreak && inWord) {
                var _sp = 0;
                chars(line).forEach(function (c, idx) {
                  if (c === ' ') _sp = idx + 1;
                });
                if (_sp > 0) {
                  lastBreak = _sp;
                  okBreak = true;
                }
              }
              if (!okBreak) {
                lastBreak = 0;
                var _k5 = i - 1;
                while (_k5 > i - _n6 && glued(_k5)) _k5--;
                var visible = 0;
                for (var _j2 = i - _n6; _j2 <= _k5; _j2++) if (at(_j2) !== undefined && at(_j2) !== ' ') visible++;
                if (_k5 > i - _n6 && visible < 2 || _k5 <= i - _n6) {
                  softGlue = false;
                  _k5 = i - 1;
                  while (_k5 > i - _n6 && glued(_k5)) _k5--;
                  softGlue = true;
                }
                if (_k5 > i - _n6 && _k5 < i - 1) lastBreak = _k5 - (i - 1 - _n6);
              }
              if (lastBreak > 0 && lastBreak < _n6) {
                var _lc2 = chars(line);
                lines.push(trimEnd(_lc2.slice(0, lastBreak).join('')));
                line = trimStart(_lc2.slice(lastBreak).join(''));
                lastBreak = 0;
              } else {
                lines.push(line);
                line = '';
                lastBreak = 0;
              }
            } else {
              line = trial;
              i++;
              if (breakable(i - 1)) lastBreak = len(line);
            }
          };
          while (i <= ch.length) {
            _loop2();
          }
          lines.push(line);
          paraEnd[lines.length] = true;
        };
        for (var _iterator = _createForOfIteratorHelperLoose(text.split('\n')), _step; !(_step = _iterator()).done;) {
          _loop();
        }
        lines = lines.map(function (l) {
          return trim(l.split(ZW).join(''));
        });
        var L1 = function L1(k) {
          return lines[k - 1];
        };
        var set = function set(k, v) {
          lines[k - 1] = v;
        };
        var lastChar = function lastChar(t) {
          var c = chars(t);
          return c[c.length - 1];
        };
        var dropLast = function dropLast(t) {
          var c = chars(t);
          c.pop();
          return c.join('');
        };
        // A last line that is only a number takes the character before it along.
        {
          var k = lines.length;
          var cur = L1(k),
            prev = L1(k - 1);
          if (spaced) {
            // Spaced text: the last word of the line before comes along instead.
            var sp = (prev != null ? prev : '').lastIndexOf(' ');
            if (k >= 2 && /^[\t-\r %,\.0-9\xA0\xD7\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+$/.test(cur) && sp > 0 && tw(prev.slice(sp + 1) + ' ' + cur) <= width) {
              set(k - 1, trimEnd(prev.slice(0, sp)));
              set(k, prev.slice(sp + 1) + ' ' + cur);
            }
          } else if (k >= 2 && /^[\t-\r %,\.0-9\xA0\xD7\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+$/.test(cur) && len(prev) >= 3) {
            var moved = lastChar(prev);
            if (!/[0-9\s]/.test(moved) && tw(moved + ' ' + cur) <= width) {
              set(k - 1, dropLast(prev));
              set(k, moved + ' ' + cur);
            }
          }
        }
        // No orphan: a last line of one character takes the previous line's last character with it.
        for (var _k = 2; _k <= lines.length; _k++) {
          var _cur = L1(_k),
            _prev = L1(_k - 1);
          var core = _cur;
          while (len(core) > 1 && BREAK_AFTER.has(lastChar(core))) core = dropLast(core);
          if (!spaced && len(core) === 1 && !isAscii(core) && len(_prev) >= 3 && !BREAK_AFTER.has(core)) {
            var _moved = lastChar(_prev);
            if (!/[0-9\s]/.test(_moved) && !BREAK_AFTER.has(_moved) && tw(_moved + _cur) <= width) {
              set(_k - 1, dropLast(_prev));
              set(_k, _moved + _cur);
            }
          }
        }
        var join = function join(x, y) {
          if (x === '') return y;
          if (y === '') return x;
          var l = lastChar(x),
            f = chars(y)[0];
          if (asciiish(l) && !asciiish(f) || !asciiish(l) && asciiish(f)) {
            if (!BREAK_AFTER.has(l) && !BREAK_AFTER.has(f) && !OPEN_BEFORE.has(l)) return x + ' ' + y;
          }
          return x + y;
        };
        var hard = function hard(a, b) {
          var ca = chars(a),
            cb = chars(b);
          var l = ca[ca.length - 1],
            f = cb[0];
          if (l === undefined || f === undefined) return true;
          if (OPEN_BEFORE.has(l)) return false;
          if (f !== ' ' && BREAK_AFTER.has(f)) return false;
          if (isNumChar(l) && isNumChar(f)) return false;
          if (/^[0-9]$/.test(l) && !asciiish(f) && !BREAK_AFTER.has(f)) return false;
          if (CN_NUM.has(l) && CN_MEASURE.has(f)) return false;
          if (cb[1] !== undefined && cb[1] !== ' ' && BREAK_AFTER.has(cb[1]) && f !== ' ' && !BREAK_AFTER.has(f) && cb.length > 2) return false;
          // Lua compares byte positions: a word that starts inside a and ends inside b splits it.
          var joined = a + b;
          var alen = utf8Len(a);
          for (var _iterator2 = _createForOfIteratorHelperLoose(NO_SPLIT), _step2; !(_step2 = _iterator2()).done;) {
            var word = _step2.value;
            var from = 0;
            for (;;) {
              var idx = joined.indexOf(word, from);
              if (idx < 0) break;
              var start = utf8Len(joined.slice(0, idx)) + 1,
                end = start + utf8Len(word) - 1;
              if (start <= alen && end > alen) return false;
              from = idx + 1;
            }
          }
          return true;
        };
        var loneNumber = function loneNumber(t) {
          var rest = t.replace(/^[0-9.,]+/, '').replace(/^\xD7[\.0-9]+/, '').replace(/^%/, '');
          if (rest === t) return false;
          return len(trimStart(rest)) <= 1;
        };
        var soft = function soft(a, b, last) {
          var ca = chars(a),
            cb = chars(b);
          var l = ca[ca.length - 1],
            f = cb[0];
          if (l !== undefined && f !== undefined && MEASURE.has(l) && f !== ' ' && !BREAK_AFTER.has(f)) return false;
          if (last && loneNumber(b)) return false;
          return true;
        };
        var enough = function enough(t) {
          return len(t.replace(/\s/g, '')) >= 2;
        };
        var fitW = width * .98;
        var down = function down(ca, b, n) {
          return [trim(ca.slice(0, ca.length - n).join('')), join(trim(ca.slice(ca.length - n).join('')), b)];
        };
        for (var _k2 = 1; _k2 <= lines.length - 1; _k2++) {
          if (paraEnd[_k2] || spaced) continue;
          var a = L1(_k2),
            b = L1(_k2 + 1);
          var last = _k2 + 1 === lines.length || !!paraEnd[_k2 + 1];
          var needHard = !hard(a, b);
          if (needHard || !soft(a, b, last)) {
            var ca = chars(a),
              cb = chars(b);
            var done = false;
            for (var n = 1; n <= Math.min(6, ca.length - 1); n++) {
              var _down = down(ca, b, n),
                na = _down[0],
                nb = _down[1];
              if (enough(na) && hard(na, nb) && soft(na, nb, last) && tw(nb) <= fitW) {
                set(_k2, na);
                set(_k2 + 1, nb);
                done = true;
                break;
              }
            }
            if (!done) {
              for (var _n = 1; _n <= Math.min(6, cb.length - 1); _n++) {
                var _na = join(a, trim(cb.slice(0, _n).join('')));
                var _nb = trim(cb.slice(_n).join(''));
                if (_nb !== '' && hard(_na, _nb) && soft(_na, _nb, last) && tw(_na) <= fitW) {
                  set(_k2, _na);
                  set(_k2 + 1, _nb);
                  done = true;
                  break;
                }
              }
            }
            if (!done && needHard) {
              for (var _n2 = 1; _n2 <= Math.min(6, ca.length - 1); _n2++) {
                var _down2 = down(ca, b, _n2),
                  _na2 = _down2[0],
                  _nb2 = _down2[1];
                if (enough(_na2) && hard(_na2, _nb2) && tw(_nb2) <= fitW) {
                  set(_k2, _na2);
                  set(_k2 + 1, _nb2);
                  done = true;
                  break;
                }
              }
            }
            if (!done && needHard) {
              for (var _n3 = 1; _n3 <= Math.min(6, ca.length - 1); _n3++) {
                var _down3 = down(ca, b, _n3),
                  _na3 = _down3[0],
                  _nb3 = _down3[1];
                if (_na3 !== '' && hard(_na3, _nb3) && tw(_nb3) <= fitW) {
                  set(_k2, _na3);
                  set(_k2 + 1, _nb3);
                  break;
                }
              }
            }
          }
        }
        // A paragraph's last line of only two characters takes words from the line above (Chinese; a short last word
        // in spaced text is fine).
        for (var _k3 = 2; _k3 <= lines.length; _k3++) {
          if (!spaced && !paraEnd[_k3 - 1] && (_k3 === lines.length || paraEnd[_k3])) {
            var _cur2 = L1(_k3);
            var _core = _cur2;
            while (len(_core) > 1 && BREAK_AFTER.has(lastChar(_core))) _core = dropLast(_core);
            if (len(_core.replace(/\s/g, '')) === 2) {
              var _ca = chars(L1(_k3 - 1));
              for (var _n4 = 1; _n4 <= Math.min(4, _ca.length - 3); _n4++) {
                var _down4 = down(_ca, _cur2, _n4),
                  _na4 = _down4[0],
                  _nb4 = _down4[1];
                if (len(_na4.replace(/\s/g, '')) >= 3 && hard(_na4, _nb4) && soft(_na4, _nb4, true) && tw(_nb4) <= fitW) {
                  set(_k3 - 1, _na4);
                  set(_k3, _nb4);
                  break;
                }
              }
            }
          }
        }
        return lines;
      }

      // Packs whole phrases (parts between U+200B marks) onto lines; unchanged when there are no marks or a phrase is too wide.
      function phraseLines(text, size, family, width) {
        if (!text.includes(ZW)) return text;
        var lines = [];
        var line = '';
        for (var _iterator4 = _createForOfIteratorHelperLoose(text.split(ZW)), _step4; !(_step4 = _iterator4()).done;) {
          var phrase = _step4.value;
          if (textWidth(phrase, size, family) > width * .95) return text;
          if (line !== '' && textWidth(line + phrase, size, family) > width * .95) {
            lines.push(line);
            line = phrase;
          } else line = line + phrase;
        }
        if (line !== '') lines.push(line);
        return lines.join('\n');
      }
      function fitSize(text, sizeIn, family, width) {
        var size = sizeIn;
        while (size > 9 && textWidth(text, size, family) > width * .92) size = Math.max(9, size - .5);
        return size;
      }
      function fitText(text, size, family, width) {
        var s = fitSize(text, size, family, width);
        if (textWidth(text, s, family) <= width * .92 || family === 'body') return [s, family];
        return [fitSize(text, size, 'body', width), 'body'];
      }

      // The lines of an S.Block: wrap at 95% (or wrapWidth), shrink to maxLines (not below minSize), then cap with "…".
      function blockLines(text, sizeIn, family, width, maxLines, minSize, wrapWidth) {
        if (minSize === void 0) {
          minSize = 9;
        }
        var size = sizeIn;
        var limit = wrapWidth != null ? wrapWidth : width * .95;
        var lines = wrap(text, size, family, limit);
        while (maxLines && lines.length > maxLines && size > minSize) {
          size = Math.max(minSize, size - .5);
          lines = wrap(text, size, family, limit);
        }
        if (maxLines && lines.length > maxLines) {
          var keep = lines.slice(0, maxLines);
          var last = chars(keep[maxLines - 1]);
          var TRIM = new Set([' ', '，', '。', '、', ',']);
          var joined = function joined() {
            var n = last.length;
            while (n > 1 && TRIM.has(last[n - 1])) n--;
            return last.slice(0, n).join('') + '…';
          };
          while (last.length > 1 && textWidth(joined(), size, family) > limit) last.pop();
          keep[maxLines - 1] = joined();
          lines = keep;
        }
        return {
          lines: lines,
          size: size
        };
      }

      // Unified number display: thousands separators below one million, then "123.4万" (myriad languages) or "1.2M".
      function formatNumber(nIn) {
        var n = Math.floor(Number(nIn) || 0);
        var neg = n < 0;
        if (neg) n = -n;
        var s;
        if (n >= 1000000) {
          if (usesMyriad()) s = L('{0}万', (Math.floor(n / 1000) / 10).toFixed(1).replace(/\.0$/, ''));else s = (Math.floor(n / 100000) / 10).toFixed(1).replace(/\.0$/, '').replace('.', numberSeparators().decimal) + 'M';
        } else s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, numberSeparators().group);
        return (neg ? '-' : '') + s;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/tips.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './board.ts', './kit.ts', './skin.ts', './assets.ts', './i18n.ts', './text.ts'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy, FindMove, UI, Image, Face, Text, ink, ImageButton, muted, resolveAsset, L, phraseLines, textWidth;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      FindMove = module.FindMove;
    }, function (module) {
      UI = module.UI;
    }, function (module) {
      Image = module.Image;
      Face = module.Face;
      Text = module.Text;
      ink = module.ink;
      ImageButton = module.ImageButton;
      muted = module.muted;
    }, function (module) {
      resolveAsset = module.resolveAsset;
    }, function (module) {
      L = module.L;
    }, function (module) {
      phraseLines = module.phraseLines;
      textWidth = module.textWidth;
    }],
    execute: function () {
      exports({
        Begin: Begin,
        Blocked: Blocked,
        Close: Close,
        Event: Event,
        InputBlocked: InputBlocked,
        Move: Move,
        New: New,
        Next: Next,
        Observe: Observe,
        Placement: Placement,
        Show: Show,
        Update: Update,
        Waiting: Waiting
      });
      cclegacy._RF.push({}, "f4191DGCbxF3YwBRBgLp2JY", "tips", undefined);
      function New() {
        return {
          pending: {},
          stable: false,
          opened: false
        };
      }
      function Observe(state, event) {
        if (event.type === 'clear') {
          state.pending[2] = true;
          if (event.cascade > 1) state.pending[3] = true;
          state.stable = false;
        } else if (event.type === 'cat' && event.clip === 'assist' && event.context !== 'ending') {
          var _state$catId;
          // Run resets charge immediately before this event, then resolves the skill.
          state.catId = (_state$catId = state.catId) != null ? _state$catId : event.id;
          state.pending[5] = true;
          state.stable = false;
        } else if (event.type === 'settled') state.stable = true;else if (event.type === 'opening_settled') {
          state.opened = true;
          state.pending[1] = true;
          state.stable = true;
        } else if (event.type === 'choice_open') state.pending[4] = true;else if (event.type === 'swap' || event.type === 'fall' || event.type === 'transform') state.stable = false;
      }
      // context: {screen, countdown, busy}; only a stable board or the choice overlay may show tips.
      function Next(tipsIn, state, context) {
        var tips = tipsIn != null ? tipsIn : {};
        if (tips.skipped || context.busy || context.countdown) return undefined;
        for (var id = 1; id <= 5; id++) {
          if (state.pending[id] && !tips[String(id)]) {
            if (id === 4) {
              if (context.screen === 'upgrade') return id;
            } else if (state.stable && context.screen === 'game') return id;
          }
        }
        return undefined;
      }
      function Move(board) {
        var m = FindMove(board);
        return m ? {
          r: m[0],
          c: m[1],
          rr: m[2],
          cc: m[3]
        } : undefined;
      }
      // All player copy is localized at use time. U+200B marks whole-phrase break opportunities.
      var ZW = '​';
      var COPY = exports('COPY', ['交换相邻商品，' + ZW + '三个一样就会消除。', '消除得分装进订单，' + ZW + '偏好品算双倍。', '落下的商品又连成一排，' + ZW + '就是连消，越连分越高。', '交够几单就能挑道具，' + ZW + '最多带 5 件。', '消除会给猫攒能量，' + ZW + '攒满它就来帮忙。']);
      // Pure placement in the 360x640 play canvas.
      function Placement(id, target) {
        var x = Math.max(8, Math.min(82, target.x + target.w / 2 - 135));
        var below = id !== 3 && id !== 4 && target.y + target.h + 126 <= 640;
        var y = below ? target.y + target.h + 14 : target.y - 124;
        // Never over the time/score plates (end y~60).
        y = Math.max(64, y);
        if (!(below || y + 112 <= target.y + 2)) throw new Error("tip card cannot fit clear of the time/score plates: tip " + id + " target y=" + target.y + " card y=" + y);
        return {
          x: x,
          y: y,
          w: 270,
          h: 112,
          below: below,
          pointerX: target.x + target.w / 2 - x - 12
        };
      }
      var rect = function rect(app, w) {
        return w.RectIn(app.page);
      };
      function targetFor(app, id) {
        var g = app.g,
          refs = g.play;
        if (id === 1) {
          var move = Move(g.run.board);
          if (!move) return undefined;
          var a = rect(app, g.tiles[move.r][move.c].panel),
            b = rect(app, g.tiles[move.rr][move.cc].panel);
          var x = Math.min(a.x, b.x),
            y = Math.min(a.y, b.y);
          return [{
            x: x,
            y: y,
            w: Math.max(a.x + a.w, b.x + b.w) - x,
            h: Math.max(a.y + a.h, b.y + b.h) - y
          }, [a, b], move];
        }
        if (id === 2) return [rect(app, refs.orderCard)];
        if (id === 3) return [rect(app, refs.chainStrip)];
        if (id === 4) {
          // The whole item panel stays undimmed; the card and the glow point at the title strip.
          var title = app.refs.itemOverlayTitle;
          if (!title) return undefined;
          var t = rect(app, title);
          var panel = app.refs.itemOverlayPanel;
          if (panel) t.hole = rect(app, panel);
          return [t];
        }
        for (var _iterator = _createForOfIteratorHelperLoose(refs.catStates), _step; !(_step = _iterator()).done;) {
          var _app$tipState;
          var slot = _step.value;
          if (slot.cat && slot.cat.id === ((_app$tipState = app.tipState) == null ? void 0 : _app$tipState.catId)) {
            // The whole wooden plate (ring + name band with its rim), with four units clear on every side.
            var _b = rect(app, slot.badge);
            return [{
              x: _b.x - 6,
              y: _b.y - 6,
              w: _b.w + 12,
              h: _b.h + 15
            }];
          }
        }
        return undefined;
      }
      // Drawn at source density, then scaled, so the catalog's source corners stay intact.
      function sliced(id, x, y, w, h) {
        var _asset$slices;
        var asset = resolveAsset(id);
        if (!asset) throw new Error('Missing accepted tip asset: ' + id);
        var density = id === 'ui.tips.glow_frame' ? 6 : 3;
        var p = Image(id, x, y, w * density, h * density);
        p.SetStyle({
          backgroundFit: 'sliced',
          backgroundSlice: (_asset$slices = asset.slices) != null ? _asset$slices : asset.slice,
          scale: 1 / density,
          transformOrigin: 'top-left'
        });
        return p;
      }
      function save(app, tip, skip, after) {
        tip.saving = true;
        var _app$profile$MarkTip = app.profile.MarkTip(tip.id, skip),
          ok = _app$profile$MarkTip[0],
          err = _app$profile$MarkTip[1];
        tip.saving = false;
        tip.saved = ok;
        tip.error = err;
        tip.label.SetText(ok ? L('知道了') : L('重试保存'));
        if (!ok) console.log('[Tips] save failed: ' + err);
        if (ok && after) after();
      }
      function fadeOut(app, tip) {
        tip.closingAt = app.clock + .18;
        tip.root.Animate({
          keyframes: {
            0: {
              opacity: 1
            },
            1: {
              opacity: 0
            }
          },
          duration: .18,
          fillMode: 'both'
        });
        tip.card.Animate({
          keyframes: {
            0: {
              translateY: 0
            },
            1: {
              translateY: -6
            }
          },
          duration: .18,
          fillMode: 'both'
        });
      }
      function Close(app, skip) {
        var tip = app.activeTip;
        if (!tip || tip.saving || tip.closingAt !== undefined) return;
        if (skip || !tip.saved) save(app, tip, skip, function () {
          return fadeOut(app, tip);
        });else fadeOut(app, tip);
      }
      function Show(app, id) {
        var _target$hole;
        var g = app.g;
        var found = targetFor(app, id);
        if (!found) return false;
        var target = found[0],
          frames = found[1],
          move = found[2];
        var p = Placement(id, target);
        // The root takes every touch: a tap anywhere closes the tip.
        var root = UI.Panel({
          position: 'absolute',
          left: 0,
          top: 0,
          width: 360,
          height: 640,
          outsideDim: [73, 47, 29, 89],
          onClick: function onClick() {
            return Close(app, false);
          }
        });
        // Four rectangles leave the actual target undimmed; the root still consumes input in the hole.
        var hole = (_target$hole = target.hole) != null ? _target$hole : target;
        var veil = [73, 47, 29, 89];
        for (var _i = 0, _arr = [[0, 0, 360, hole.y], [0, hole.y + hole.h, 360, 640 - hole.y - hole.h], [0, hole.y, hole.x, hole.h], [hole.x + hole.w, hole.y, 360 - hole.x - hole.w, hole.h]]; _i < _arr.length; _i++) {
          var b = _arr[_i];
          root.AddChild(UI.Panel({
            position: 'absolute',
            left: b[0],
            top: b[1],
            width: b[2],
            height: b[3],
            backgroundColor: veil,
            pointerEvents: 'none'
          }));
        }
        if (id === 5) {
          // A two-unit soft edge inside the hole (the Maker draws a linear gradient): two one-unit steps.
          var x = hole.x,
            y = hole.y,
            w = hole.w,
            h = hole.h;
          for (var _i2 = 0, _arr2 = [[0, 67], [1, 22]]; _i2 < _arr2.length; _i2++) {
            var _arr2$_i = _arr2[_i2],
              k = _arr2$_i[0],
              a = _arr2$_i[1];
            var c = [73, 47, 29, a];
            for (var _i3 = 0, _arr3 = [[x + k, y, 1, h], [x + w - 1 - k, y, 1, h], [x, y + k, w, 1], [x, y + h - 1 - k, w, 1]]; _i3 < _arr3.length; _i3++) {
              var _b2 = _arr3[_i3];
              root.AddChild(UI.Panel({
                position: 'absolute',
                left: _b2[0],
                top: _b2[1],
                width: _b2[2],
                height: _b2[3],
                backgroundColor: c,
                pointerEvents: 'none'
              }));
            }
          }
        }
        for (var _iterator2 = _createForOfIteratorHelperLoose(frames != null ? frames : [target]), _step2; !(_step2 = _iterator2()).done;) {
          var _b4 = _step2.value;
          var pad = id === 5 ? 0 : 4;
          root.AddChild(sliced('ui.tips.glow_frame', _b4.x - pad, _b4.y - pad, _b4.w + 2 * pad, _b4.h + 2 * pad));
        }
        if (move && frames) {
          var _a = frames[0],
            _b3 = frames[1];
          var arrow = Image('ui.tips.swipe_arrow', (_a.x + _a.w / 2 + _b3.x + _b3.w / 2) / 2 - 10, (_a.y + _a.h / 2 + _b3.y + _b3.h / 2) / 2 - 16, 20, 32);
          arrow.SetStyle({
            rotate: move.rr > move.r ? 180 : 90
          });
          root.AddChild(arrow);
          root.AddChild(Image('ui.tips.hand', _a.x + _a.w * .55, _a.y + _a.h * .55, 40, 48));
        }
        // 270x112 (the approved concept's card is ~111 tall).
        var card = UI.Panel({
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: 270,
          height: 112,
          overflow: 'visible',
          onClick: function onClick() {}
        });
        var pointer = Image('ui.tips.pointer', p.pointerX, p.below ? -13 : 110, 24, 15);
        pointer.SetStyle({
          rotate: p.below ? 0 : 180
        });
        card.AddChild(pointer);
        card.AddChild(sliced('ui.tips.card', 0, 0, 270, 112));
        card.AddChild(Image('ui.cats.skill_medallion', 17, 13, 52, 52));
        // Round-masked copy of the approved selector avatar.
        card.AddChild(Image('ui.tips.avatar_tuantuan', 23, 19, 40, 40));
        var _S$Face = Face('ui.tips.card', 0, 0, 270, 112, 6),
          fx = _S$Face[0],
          fy = _S$Face[1],
          fw = _S$Face[2];
        var tx = 72,
          width = fx + fw - tx;
        var copy = L(COPY[id - 1]);
        // Tips 3 and 4 use the full measured safe width; every tip body is 12 pt.
        var lineWidth = id === 3 || id === 4 ? width : width * .95;
        var size = 12;
        var lines = phraseLines(copy, size, 'body', lineWidth / .95).split('\n');
        if (lines.length > 2 || lines.some(function (line) {
          return textWidth(line, size, 'body') > lineWidth;
        })) console.warn('[Tips] copy exceeds two lines at 12 pt: ' + id);
        lines.forEach(function (line, i) {
          return card.AddChild(Text(line, size, tx, fy + 3 + i * 20, width, 20, ink, 'left', 'body'));
        });
        var _S$ImageButton = ImageButton('ui.item_overlay.button.primary', 158, 62, 96, 34, function () {
            return Close(app, false);
          }, {
            hitPad: 5
          }),
          buttonRoot = _S$ImageButton[0],
          button = _S$ImageButton[1],
          face = _S$ImageButton[2];
        var _S$Face2 = Face('ui.item_overlay.button.primary', 0, 0, 96, 34, 6),
          bx = _S$Face2[0],
          by = _S$Face2[1],
          bw = _S$Face2[2],
          bh = _S$Face2[3];
        var label = Text(L('知道了'), 14, bx, by, bw, bh, ink, 'center', 'sans');
        face.AddChild(label);
        card.AddChild(buttonRoot);
        var skip = UI.Button({
          position: 'absolute',
          left: 19,
          top: 58,
          width: 96,
          height: 44,
          onClick: function onClick() {
            return Close(app, true);
          }
        });
        skip.AddChild(Text(L('跳过引导'), 11, 0, 9, 96, 20, muted, 'left', 'body'));
        card.AddChild(skip);
        root.AddChild(card);
        app.page.AddChild(root);
        g.drag = undefined;
        g.queued = undefined;
        g.selected = undefined;
        app.activeTip = {
          id: id,
          root: root,
          card: card,
          page: app.page,
          target: target,
          button: button,
          skip: skip,
          label: label
        };
        root.Animate({
          keyframes: {
            0: {
              opacity: 0
            },
            1: {
              opacity: 1
            }
          },
          duration: .18,
          fillMode: 'both'
        });
        card.Animate({
          keyframes: {
            0: {
              translateY: 6
            },
            1: {
              translateY: 0
            }
          },
          duration: .18,
          fillMode: 'both'
        });
        save(app, app.activeTip, false);
        return true;
      }
      function Begin(app) {
        app.tipState = New();
        app.tipRun = app.g.run;
        app.activeTip = undefined;
        app.tipReadyAt = app.clock;
      }
      function Event(app, event) {
        var _app$g;
        if (app.tipRun !== ((_app$g = app.g) == null ? void 0 : _app$g.run) || !app.tipState) return;
        Observe(app.tipState, event);
        if (event.type === 'settled' || event.type === 'choice_open') app.tipReadyAt = app.clock + .32;
      }
      function Blocked(app) {
        return app.activeTip !== undefined;
      }
      // Board input also waits for the opening tip.
      function InputBlocked(app) {
        var _app$profile$tips, _app$g2;
        if (app.activeTip) return true;
        var st = app.tipState,
          tips = (_app$profile$tips = app.profile.tips) != null ? _app$profile$tips : {};
        return app.tipRun === ((_app$g2 = app.g) == null ? void 0 : _app$g2.run) && st !== undefined && !st.opened && !tips.skipped && !tips['1'];
      }
      function Waiting(app) {
        var _app$g3;
        return app.tipRun === ((_app$g3 = app.g) == null ? void 0 : _app$g3.run) && app.tipState !== undefined && Next(app.profile.tips, app.tipState, {
          screen: app.screen
        }) !== undefined;
      }
      function Update(app) {
        var _app$tipReadyAt, _g$presentation$Busy, _g$presentation;
        var g = app.g;
        if (!g || app.tipRun !== g.run || !app.tipState) return;
        var tip = app.activeTip;
        if (tip) {
          if (tip.page !== app.page || tip.closingAt !== undefined && app.clock >= tip.closingAt) {
            tip.root.Destroy();
            app.activeTip = undefined;
          } else return;
        }
        if (app.screen !== 'game' && app.screen !== 'upgrade') return;
        if (app.screen === 'game' && !app.tipState.opened && g.resumeDelay <= 0 && !g.countdown && g.run.phase === 'idle') Event(app, {
          type: 'opening_settled'
        });
        if (app.clock < ((_app$tipReadyAt = app.tipReadyAt) != null ? _app$tipReadyAt : 0) || g.pendingScreen === 'result' || g.run.phase === 'finished') return;
        var id = Next(app.profile.tips, app.tipState, {
          screen: app.screen,
          countdown: g.resumeDelay > 0 || g.countdown !== undefined,
          busy: app.profile.busy || ((_g$presentation$Busy = (_g$presentation = g.presentation) == null ? void 0 : _g$presentation.Busy()) != null ? _g$presentation$Busy : false) || g.invalidLeft > 0
        });
        if (id !== undefined) Show(app, id);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/types.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        mapLocaleTag: mapLocaleTag,
        pickLanguage: pickLanguage,
        savedLanguage: savedLanguage
      });
      cclegacy._RF.push({}, "c40d2Jv1ahErqrcZ+sae3w6", "types", undefined); // The six platform interfaces (Maker repo docs/port-plan.md §8.3). Platform differences live only behind these; core/
      // and ui/ never branch on the platform (tests/boundary.test.ts). Each mirrors a Maker gate so the existing contracts
      // carry over unchanged: Storage = Profile's injected storage, Ads = Ads.ShowRewarded's adapter, Shell = App.lua's
      // safe-area read, Locale = the engine language, Lifecycle = pause/back/focus (F11), Analytics optional.
      // Profile storage (scripts/Game/Profile.lua nativeStorage): two save slots, JSON objects; errors are player-facing
      // Chinese templates, translated by the caller through L().
      // Rewarded video (scripts/Game/Ads.lua adapter contract, docs/monetization-design.md "客户端请求合同"): show returns
      // whether the platform accepted the request; done may run synchronously, later, twice or never - the Ads service
      // above it turns that into exactly one completion. Only the platform's own completed-view flag grants a reward.
      // es/pt/de/fr/ru/ko are port-only tables (i18n/ in this repo; the Maker build ships Chinese only).
      var SUPPORTED_LANGUAGES = exports('SUPPORTED_LANGUAGES', ['zh_CN', 'zh_TW', 'ja', 'en', 'es', 'pt', 'de', 'fr', 'ru', 'ko']);

      // The settings picker's order (approved concept 2026-10-30): both Chinese scripts, then English and Japanese first.
      var PICKER_LANGUAGES = exports('PICKER_LANGUAGES', ['zh_CN', 'zh_TW', 'en', 'ja', 'ko', 'es', 'pt', 'de', 'fr', 'ru']);

      // Overseas builds fall back to English, not the simplified-Chinese source (docs/port-plan.md §9).
      function pickLanguage(preferred, fallback) {
        if (fallback === void 0) {
          fallback = 'en';
        }
        for (var _iterator = _createForOfIteratorHelperLoose(preferred), _step; !(_step = _iterator()).done;) {
          var p = _step.value;
          if (SUPPORTED_LANGUAGES.includes(p)) return p;
        }
        return fallback;
      }

      // The player's saved choice from the settings picker, if it is still a supported language.
      function savedLanguage(saved) {
        return typeof saved === 'string' && SUPPORTED_LANGUAGES.includes(saved) ? saved : undefined;
      }

      // Maps BCP 47 tags (navigator.language, Android/iOS locale) to the game's codes.
      function mapLocaleTag(tag) {
        var t = tag.replace('_', '-').toLowerCase();
        if (t === 'zh-tw' || t === 'zh-hk' || t === 'zh-mo' || t.startsWith('zh-hant')) return 'zh_TW';
        if (t.startsWith('zh')) return 'zh_CN';
        if (t.startsWith('ja')) return 'ja';
        if (t.startsWith('en')) return 'en';
        // Portuguese is written for Brazil; European Portuguese players get it too (closer than English).
        for (var _i = 0, _arr = ['es', 'pt', 'de', 'fr', 'ru', 'ko']; _i < _arr.length; _i++) {
          var code = _arr[_i];
          if (t === code || t.startsWith(code + '-')) return code;
        }
        return undefined;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/vfxState.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        Breath: Breath,
        CellScale: CellScale,
        Fire: Fire,
        Merge: Merge,
        NewCharge: NewCharge,
        Path: Path,
        PawPoint: PawPoint,
        PawRoute: PawRoute,
        PawSprites: PawSprites,
        Representatives: Representatives,
        SetCharge: SetCharge,
        TargetKey: TargetKey,
        UpdateCharge: UpdateCharge
      });
      cclegacy._RF.push({}, "80468nQPV9OB6b2ANCBWt9K", "vfxState", undefined); // Presentation-only state, translated from the Maker repo scripts/Game/VfxState.lua; never reads or advances the
      // gameplay RNG.
      var clamp = function clamp(v) {
        return Math.max(0, Math.min(1, v != null ? v : 0));
      };
      function NewCharge(v) {
        var c = clamp(v);
        return {
          value: c,
          target: c,
          from: c,
          age: .22,
          full: c >= 1
        };
      }
      function SetCharge(s, vIn, direct) {
        var v = clamp(vIn);
        if (direct || v < s.target) {
          s.value = v;
          s.from = v;
          s.target = v;
          s.age = .22;
          s.full = v >= 1;
        } else if (v !== s.target) {
          s.from = s.value;
          s.target = v;
          s.age = 0;
        }
      }
      function UpdateCharge(s, dt) {
        s.age = Math.min(.22, s.age + dt);
        var t = s.age / .22;
        s.value = Math.min(s.target, s.from + (s.target - s.from) * (1 - Math.pow(1 - t, 3)));
        s.full = s.value >= 1;
        return s.value;
      }
      function Fire(s) {
        SetCharge(s, 0, true);
      }
      function Breath(age) {
        var t = (1 - Math.cos(2 * Math.PI * age / 1.2)) / 2;
        return [.65 + .35 * t, 1 + .04 * t];
      }
      function CellScale(age, flip) {
        if (flip) return [.1 + .9 * Math.abs(1 - 2 * Math.min(1, age / .25)), 1];
        var t = Math.min(1, age / .24);
        var v = t < .5 ? 1 - .1 * t / .5 : t < .72 ? .9 + .28 * (t - .5) / .22 : 1.18 - .18 * (t - .72) / .28;
        return [v, v];
      }
      function TargetKey(p) {
        var _ref, _p$cat;
        return p.r !== undefined ? p.r + ":" + p.c : (_ref = (_p$cat = p.cat) != null ? _p$cat : p.hud) != null ? _ref : '';
      }
      // Nearest first, then farthest from the selected set: deterministic spatial coverage.
      function Representatives(points, x, y, limit) {
        var selected = new Set();
        if (points.length <= limit) {
          points.forEach(function (_, i) {
            return selected.add(i);
          });
          return selected;
        }
        var nearest = 0,
          distance = Infinity;
        points.forEach(function (p, i) {
          var d = Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2);
          if (d < distance) {
            nearest = i;
            distance = d;
          }
        });
        selected.add(nearest);
        var _loop = function _loop() {
          var best = -1,
            spread = -1;
          points.forEach(function (p, i) {
            if (selected.has(i)) return;
            var closest = Infinity;
            selected.forEach(function (j) {
              var q = points[j];
              closest = Math.min(closest, Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
            });
            if (closest > spread) {
              best = i;
              spread = closest;
            }
          });
          selected.add(best);
        };
        for (var n = 2; n <= limit; n++) {
          _loop();
        }
        return selected;
      }
      // One source batch, unique target cells, in first-occurrence order.
      function Merge(events) {
        var out = [],
          by = {};
        for (var _iterator = _createForOfIteratorHelperLoose(events), _step; !(_step = _iterator()).done;) {
          var _e$wave;
          var e = _step.value;
          var key = e.origin + ":" + ((_e$wave = e.wave) != null ? _e$wave : 0);
          var b = by[key];
          if (!b) {
            b = {
              origin: e.origin,
              slot: e.slot,
              wave: e.wave,
              targets: [],
              seen: {}
            };
            by[key] = b;
            out.push(b);
          }
          for (var _iterator2 = _createForOfIteratorHelperLoose((_e$targets = e.targets) != null ? _e$targets : []), _step2; !(_step2 = _iterator2()).done;) {
            var _e$targets;
            var p = _step2.value;
            var _k = TargetKey(p);
            if (!b.seen[_k]) {
              b.seen[_k] = true;
              b.targets.push(p);
            }
          }
        }
        return out;
      }
      // Page-local path that starts outside the badge/name and bends around the receipt.
      function Path(x, y, tx, ty, t) {
        if (ty >= 237) {
          var side = x < 180 ? 12 : 348;
          if (t < .38) {
            var _u = t / .38;
            return [x + (side - x) * Math.sin(_u * Math.PI / 2), y + (230 - y) * _u];
          }
          var u = (t - .38) / .62;
          var bend = Math.max(0, 42 - (ty - 230) * .35);
          return [side + (tx - side) * u, 230 + (ty - 230) * Math.sin(u * Math.PI / 2) + bend * Math.sin(Math.PI * u)];
        }
        return [x + (tx - x) * t, y + (ty - y) * t - 20 * Math.sin(Math.PI * t)];
      }
      // One direct arc from the cat's badge to the target, over the HUD (concept skill-item-vfx-r02 A): a quadratic curve
      // whose apex sits above both ends; paws 1.5x the r52 size. Deterministic.
      function PawRoute(source, target, lanes) {
        var _target$name$h, _target$name, _source$rect$w, _source$rect;
        var size = 27;
        var finish;
        if (target.kind === 'cell') finish = {
          x: target.x,
          y: target.y - target.cellSize * .42
        };else if (target.kind === 'cat') finish = {
          x: target.x,
          y: target.y + ((_target$name$h = (_target$name = target.name) == null ? void 0 : _target$name.h) != null ? _target$name$h : 18) * .2
        };else {
          var tag = lanes.tag;
          finish = {
            x: tag.x + tag.w * .5,
            y: tag.y + tag.h + 12
          };
        }
        var dx = finish.x - source.x,
          dy = finish.y - source.y;
        var len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        var r = ((_source$rect$w = (_source$rect = source.rect) == null ? void 0 : _source$rect.w) != null ? _source$rect$w : 40) * .5 + 4;
        var start = {
          x: source.x + dx / len * r,
          y: source.y + dy / len * r
        };
        var apex = Math.min(start.y, finish.y) - Math.max(24, Math.min(70, len * .22));
        var control = {
          x: (start.x + finish.x) / 2,
          y: apex
        };
        var points = [];
        for (var step = 0; step <= 32; step++) {
          var t = step / 32,
            u = 1 - t;
          points.push({
            x: u * u * start.x + 2 * u * t * control.x + t * t * finish.x,
            y: u * u * start.y + 2 * u * t * control.y + t * t * finish.y
          });
        }
        var length = 0;
        points[0].distance = 0;
        for (var _k2 = 1; _k2 < points.length; _k2++) {
          var a = points[_k2 - 1],
            b = points[_k2];
          length += Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
          b.distance = length;
        }
        // Long routes get 5-8 paws; short ones (timer tag, partner) drop to 2 so neighbours never overlap.
        var count = Math.max(2, Math.min(8, Math.floor(length / (size * 1.35)) + 1));
        return {
          points: points,
          length: length,
          start: start,
          finish: finish,
          kind: target.kind,
          pawSize: size,
          pawCount: count
        };
      }
      function PawPoint(route, tIn) {
        var d = clamp(tIn) * route.length;
        for (var i = 1; i < route.points.length; i++) {
          var _a$distance;
          var b = route.points[i],
            a = route.points[i - 1],
            from = (_a$distance = a.distance) != null ? _a$distance : 0;
          if (d <= b.distance) {
            var u = (d - from) / (b.distance - from);
            return [a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u];
          }
        }
        return [route.finish.x, route.finish.y];
      }
      function pawPositions(route, count) {
        var _route$pawSize;
        var out = [];
        var size = (_route$pawSize = route.pawSize) != null ? _route$pawSize : 18;
        for (var i = 1; i <= count; i++) {
          var _PawPoint = PawPoint(route, (i - 1) / (count - 1)),
            x = _PawPoint[0],
            y = _PawPoint[1];
          out.push({
            x: x + (i % 2 === 0 ? 2 : -2) * size / 18,
            y: y,
            size: size,
            angle: i % 2 === 0 ? .22 : -.22
          });
        }
        return out;
      }
      function PawSprites(route, age) {
        var out = [];
        var positions = route.paws;
        if (!positions) {
          for (var count = (_route$pawCount = route.pawCount) != null ? _route$pawCount : 6; count >= 2; count--) {
            var _route$pawCount;
            positions = pawPositions(route, count);
            var spaced = true;
            for (var i = 1; i < positions.length; i++) {
              var a = positions[i - 1],
                b = positions[i];
              if (Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) < Math.pow(a.size * 1.2, 2)) {
                spaced = false;
                break;
              }
            }
            if (spaced) break;
          }
          route.paws = positions;
        }
        var list = positions;
        list.forEach(function (p, i) {
          var t = age - i * (.225 / (list.length - 1));
          if (t > 0 && age < .38) out.push({
            x: p.x,
            y: p.y,
            size: p.size,
            angle: p.angle,
            alpha: Math.min(1, t / .035) * Math.min(1, (.38 - age) / .08)
          });
        });
        return out;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/widgets.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './kit.ts'], function (exports) {
  var _inheritsLoose, _extends, cclegacy, Color, Node, UITransform, Sprite, Graphics, W, loadSpriteFrame;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _extends = module.extends;
    }, function (module) {
      cclegacy = module.cclegacy;
      Color = module.Color;
      Node = module.Node;
      UITransform = module.UITransform;
      Sprite = module.Sprite;
      Graphics = module.Graphics;
    }, function (module) {
      W = module.W;
      loadSpriteFrame = module.loadSpriteFrame;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4f0eaGj01JBDqTREceVAzq7", "widgets", undefined);
      var SOFT = [244, 229, 205, 255]; // the catshop theme's surface colour (Design.lua D.colors.soft): the track

      // urhox ProgressBar: track in the theme surface colour, the fill rounded on the left only until it is full, the border
      // drawn over both.
      var ProgressBar = exports('ProgressBar', /*#__PURE__*/function (_W) {
        _inheritsLoose(ProgressBar, _W);
        function ProgressBar(props) {
          var _this;
          _this = _W.call(this, 'ProgressBar', _extends({}, props)) || this;
          _this.g = void 0;
          var n = new Node('bar');
          n.layer = _this.node.layer;
          n.addComponent(UITransform).setAnchorPoint(0, 1);
          _this.g = n.addComponent(Graphics);
          _this.node.addChild(n);
          _this.Draw();
          return _this;
        }
        var _proto = ProgressBar.prototype;
        _proto.SetValue = function SetValue(v) {
          this.props.value = v;
          this.Draw();
        };
        _proto.layout = function layout() {
          _W.prototype.layout.call(this);
          if (this.g) this.Draw();
        };
        _proto.Draw = function Draw() {
          var _ref, _ref2, _this$props$borderWid;
          var g = this.g;
          var _this$GetLayout = this.GetLayout(),
            w = _this$GetLayout.w,
            h = _this$GetLayout.h;
          var value = (_ref = this.props.value) != null ? _ref : 0,
            max = (_ref2 = this.props.max) != null ? _ref2 : 1;
          var r = Math.min(typeof this.props.borderRadius === 'number' ? this.props.borderRadius : 4, Math.min(w, h) / 2);
          var progress = Math.max(0, Math.min(1, value / max));
          var c = function c(v) {
            var _v$;
            return new Color(v[0], v[1], v[2], (_v$ = v[3]) != null ? _v$ : 255);
          };
          g.clear();
          g.fillColor = c(SOFT);
          g.roundRect(0, -h, w, h, r);
          g.fill();
          var fw = w * progress;
          if (fw > 0) {
            var _ref3;
            g.fillColor = c((_ref3 = this.props.fillColor) != null ? _ref3 : [239, 130, 94, 255]);
            if (fw < w) roundLeft(g, 0, 0, fw, h, Math.min(r, fw / 2, h / 2));else g.roundRect(0, -h, fw, h, r);
            g.fill();
          }
          var bw = (_this$props$borderWid = this.props.borderWidth) != null ? _this$props$borderWid : 0;
          if (bw > 0) {
            var _ref4;
            g.lineWidth = bw;
            g.strokeColor = c((_ref4 = this.props.borderColor) != null ? _ref4 : [0, 0, 0, 255]);
            g.roundRect(0, -h, w, h, r);
            g.stroke();
          }
        };
        return ProgressBar;
      }(W));
      function roundLeft(g, x, top, w, h, r) {
        var k = .5523,
          bottom = top - h;
        g.moveTo(x + r, top);
        g.lineTo(x + w, top);
        g.lineTo(x + w, bottom);
        g.lineTo(x + r, bottom);
        g.bezierCurveTo(x + r - r * k, bottom, x, bottom + r - r * k, x, bottom + r);
        g.lineTo(x, top - r);
        g.bezierCurveTo(x, top - r + r * k, x + r - r * k, top, x + r, top);
        g.close();
      }

      // Immediate-mode drawing in the widget's own units (top-left origin, y down): call Begin() each frame, then Image /
      // Stroke / Circle, then End() hides the sprites not used this frame. Images come from a pool, so a frame allocates
      // nothing once the pool has grown.
      var Sketch = exports('Sketch', /*#__PURE__*/function (_W2) {
        _inheritsLoose(Sketch, _W2);
        function Sketch(props) {
          var _this2;
          _this2 = _W2.call(this, 'Sketch', _extends({}, props)) || this;
          _this2.g = void 0;
          _this2.over = void 0;
          _this2.pool = [];
          _this2.used = 0;
          var n = new Node('sketch');
          n.layer = _this2.node.layer;
          n.addComponent(UITransform).setAnchorPoint(0, 1);
          _this2.g = n.addComponent(Graphics);
          _this2.node.addChild(n);
          // A second Graphics drawn above the images (the glowing head of an item light sits on its glow sprite).
          var o = new Node('sketch-over');
          o.layer = _this2.node.layer;
          o.addComponent(UITransform).setAnchorPoint(0, 1);
          _this2.over = o.addComponent(Graphics);
          _this2.node.addChild(o);
          return _this2;
        }
        var _proto2 = Sketch.prototype;
        _proto2.Begin = function Begin() {
          this.g.clear();
          this.over.clear();
          this.used = 0;
        }
        // (x, y) is the image centre; angle in radians, clockwise on screen; tint multiplies the image colour.
        ;

        _proto2.Image = function Image(path, x, y, w, h, alpha, angle, tint) {
          var _t$;
          if (angle === void 0) {
            angle = 0;
          }
          if (alpha <= 0) return;
          var n = this.pool[this.used];
          if (!n) {
            n = new Node('img');
            n.layer = this.node.layer;
            n.addComponent(UITransform).setAnchorPoint(.5, .5);
            var _sp = n.addComponent(Sprite);
            _sp.sizeMode = Sprite.SizeMode.CUSTOM;
            _sp.type = Sprite.Type.SIMPLE;
            _sp.trim = false;
            this.node.addChild(n);
            this.pool.push(n);
          }
          this.used++;
          n.active = true;
          n.getComponent(UITransform).setContentSize(w, h);
          n.setPosition(x, -y, 0);
          n.angle = -angle * 180 / Math.PI;
          var sp = n.getComponent(Sprite);
          var t = tint != null ? tint : [255, 255, 255, 255];
          sp.color = new Color(t[0], t[1], t[2], Math.round(((_t$ = t[3]) != null ? _t$ : 255) * Math.max(0, Math.min(1, alpha))));
          if (n.path !== path) {
            n.path = path;
            loadSpriteFrame(path, function (frame) {
              if (n.path === path && sp.isValid) sp.spriteFrame = frame;
            });
          }
        }
        // Polyline stroke with round caps; points in widget units.
        ;

        _proto2.Stroke = function Stroke(points, width, color) {
          var _color$;
          if (points.length < 2) return;
          var g = this.g;
          g.lineWidth = width;
          g.lineCap = Graphics.LineCap.ROUND;
          g.lineJoin = Graphics.LineJoin.ROUND;
          g.strokeColor = new Color(color[0], color[1], color[2], Math.round((_color$ = color[3]) != null ? _color$ : 255));
          g.moveTo(points[0][0], -points[0][1]);
          for (var i = 1; i < points.length; i++) g.lineTo(points[i][0], -points[i][1]);
          g.stroke();
        };
        _proto2.Circle = function Circle(x, y, r, color, over) {
          var _color$2;
          if (over === void 0) {
            over = false;
          }
          var g = over ? this.over : this.g;
          g.fillColor = new Color(color[0], color[1], color[2], Math.round((_color$2 = color[3]) != null ? _color$2 : 255));
          g.circle(x, -y, r);
          g.fill();
        }
        // Arc stroke from a to b (radians, clockwise on screen from the +x axis), round caps.
        ;

        _proto2.Arc = function Arc(cx, cy, r, a, b, width, color) {
          var pts = [];
          var steps = Math.max(2, Math.ceil(Math.abs(b - a) / (Math.PI / 32)));
          for (var i = 0; i <= steps; i++) {
            var t = a + (b - a) * i / steps;
            pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
          }
          this.Stroke(pts, width, color);
        };
        _proto2.End = function End() {
          for (var i = this.used; i < this.pool.length; i++) this.pool[i].active = false;
          this.over.node.setSiblingIndex(this.node.children.length - 1);
        };
        return Sketch;
      }(W));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});