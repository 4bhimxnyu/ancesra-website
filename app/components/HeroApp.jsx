// The app, drawn in the page (hero, right side): the real layout of the
// Ancesra window, with the three things that float beside it since 2.8 (the
// timer card, the dictation pill, the quick-ask bar). It is a picture made of
// HTML, not a screenshot, so it stays sharp at any size and follows the page's
// fonts. Hidden from screen readers: the text next to it says the same.
// From the Figma frame "Home · top of the page".

const BARS = [8, 16, 22, 12, 18, 9];

export default function HeroApp() {
  return (
    <div className="h28-stage" aria-hidden="true">
      <div className="h28-glow" />

      <div className="h28-app">
        <div className="h28-side">
          <div className="h28-brand"><img src="/assets/logo.png" alt="" width="20" height="20" />ancesra</div>
          <div className="h28-new">+ New chat</div>
          <div className="h28-lbl">timers</div>
          <div className="h28-tm"><b>4:59</b><span>pasta</span></div>
          <div className="h28-lbl">chats</div>
          <div className="h28-row on">hash maps, fast</div>
          <div className="h28-row">fix word_count bug</div>
          <div className="h28-row">when is my midterm?</div>
          <div className="h28-row">notes for os exam</div>
        </div>
        <div className="h28-main">
          <div className="h28-tabs"><span className="on">Chat</span><span>Code</span><span>Debug</span></div>
          <div className="h28-msgs">
            <div className="h28-q">explain hash maps, fast</div>
            <div className="h28-a">
              <b>A hash map stores values under keys, and finds any key in about one step.</b>
              <ul>
                <li><b>Hashing:</b> the key becomes a number that picks a slot.</li>
                <li><b>Lookup:</b> average O(1), no searching through the list.</li>
                <li><b>Collisions:</b> two keys in one slot are kept in a small list.</li>
              </ul>
              <div className="h28-tools"><span className="on">Listen</span><span>Copy</span></div>
            </div>
          </div>
          <div className="h28-box"><span>Ask anything…</span><i className="mic" /><i className="send">↑</i></div>
          <div className="h28-offline">offline · nothing leaves this computer</div>
        </div>
      </div>

      <div className="h28-float h28-timer">
        <div className="top"><span className="t">4:59</span><span className="l">timer · pasta</span></div>
        <div className="track"><b /></div>
      </div>
      <div className="h28-float h28-dict">
        <div className="bars">{BARS.map((h, i) => <b key={i} className={`bar-${h}`} />)}</div>
        <span>listening…</span>
        <em>types into any program</em>
      </div>
      <div className="h28-float h28-quick">
        <div className="kb"><kbd>Alt</kbd>+<kbd>Space</kbd><span>from anywhere</span></div>
        <div className="in"><span>ask anything…</span><i>↑</i></div>
      </div>
    </div>
  );
}
