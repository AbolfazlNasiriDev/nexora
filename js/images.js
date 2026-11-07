/* ==========================================================================
   NEXORA — Generated product artwork (inline SVG → data URI)
   Every product illustration is drawn locally, so the store never shows a
   broken image and stays fully offline-friendly.
   ========================================================================== */

const NXArt = (() => {
  /* ---- color helpers ---------------------------------------------------- */
  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16)
    };
  }
  function mix(hex, target, amount) {
    const c1 = hexToRgb(hex);
    const c2 = hexToRgb(target);
    const t = Math.max(0, Math.min(1, amount));
    const to = (a, b) => Math.round(a + (b - a) * t).toString(16).padStart(2, '0');
    return `#${to(c1.r, c2.r)}${to(c1.g, c2.g)}${to(c1.b, c2.b)}`;
  }
  const light = (hex, amt = 0.55) => mix(hex, '#FFFFFF', amt);
  const dark = (hex, amt = 0.45) => mix(hex, '#0B0D18', amt);

  /* ---- shape library ---------------------------------------------------- */
  const S = {};

  S.phone = (a, l, d) => `
    <g transform="rotate(-6 240 246)">
      <rect x="172" y="92" width="140" height="292" rx="32" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="182" y="102" width="120" height="272" rx="24" fill="url(#screen)"/>
      <rect x="208" y="110" width="68" height="12" rx="6" fill="#0A0C18"/>
      <rect x="198" y="146" width="88" height="7" rx="3.5" fill="#fff" opacity=".2"/>
      <rect x="198" y="162" width="54" height="7" rx="3.5" fill="#fff" opacity=".12"/>
      <circle cx="242" cy="258" r="40" fill="${a}" opacity=".22"/>
      <path d="M242 230l12 22h-24z" fill="#fff" opacity=".55"/>
      <rect x="198" y="322" width="88" height="6" rx="3" fill="#fff" opacity=".14"/>
      <rect x="198" y="336" width="56" height="6" rx="3" fill="#fff" opacity=".09"/>
    </g>`;

  S.tablet = (a) => `
    <g transform="rotate(-4 240 246)">
      <rect x="126" y="118" width="228" height="264" rx="22" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="140" y="132" width="200" height="236" rx="12" fill="url(#screen)"/>
      <circle cx="240" cy="124" r="3" fill="#0A0C18"/>
      <rect x="164" y="170" width="120" height="8" rx="4" fill="#fff" opacity=".16"/>
      <rect x="164" y="190" width="80" height="8" rx="4" fill="#fff" opacity=".1"/>
      <circle cx="240" cy="288" r="44" fill="${a}" opacity=".2"/>
    </g>`;

  S.laptop = (a) => `
    <g>
      <rect x="110" y="126" width="260" height="168" rx="14" fill="url(#metal)" stroke="${a}" stroke-opacity=".3" stroke-width="2"/>
      <rect x="122" y="138" width="236" height="144" rx="7" fill="url(#screen)"/>
      <circle cx="240" cy="206" r="30" fill="${a}" opacity=".3"/>
      <path d="M240 188l10 20h-20z" fill="#fff" opacity=".45"/>
      <path d="M92 298h296l22 22q6 10-8 10H78q-14 0-8-10z" fill="url(#metal)" stroke="${a}" stroke-opacity=".22"/>
      <rect x="200" y="304" width="80" height="6" rx="3" fill="${a}" opacity=".3"/>
      <rect x="182" y="316" width="116" height="4" rx="2" fill="${a}" opacity=".14"/>
    </g>`;

  S.desktop = (a) => `
    <g>
      <rect x="150" y="104" width="180" height="280" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".3" stroke-width="2"/>
      <rect x="166" y="120" width="148" height="248" rx="12" fill="#1B1E36" opacity=".92"/>
      <circle cx="240" cy="196" r="42" fill="${a}" opacity=".3"/>
      <circle cx="240" cy="196" r="16" fill="#fff" opacity=".25"/>
      <rect x="182" y="268" width="116" height="8" rx="4" fill="#fff" opacity=".14"/>
      <rect x="182" y="286" width="78" height="8" rx="4" fill="#fff" opacity=".09"/>
      <rect x="182" y="322" width="116" height="26" rx="8" fill="${a}" opacity=".35"/>
    </g>`;

  S.monitor = (a) => `
    <g>
      <rect x="96" y="112" width="288" height="184" rx="12" fill="url(#metal)" stroke="${a}" stroke-opacity=".3" stroke-width="2"/>
      <rect x="108" y="124" width="264" height="156" rx="6" fill="url(#screen)"/>
      <circle cx="240" cy="202" r="44" fill="${a}" opacity=".28"/>
      <path d="M218 296h44l10 34h-64z" fill="url(#metal)"/>
      <rect x="178" y="330" width="124" height="12" rx="6" fill="url(#metal)" stroke="${a}" stroke-opacity=".2"/>
    </g>`;

  S.keyboard = (a) => {
    let keys = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 12; c++) {
        keys += `<rect x="${134 + c * 18}" y="${212 + r * 20}" width="14" height="15" rx="3" fill="${a}" opacity="${0.16 + (r === 0 ? 0.14 : 0)}"/>`;
      }
    }
    return `<g>
      <rect x="118" y="192" width="244" height="116" rx="16" fill="url(#metal)" stroke="${a}" stroke-opacity=".3" stroke-width="2"/>
      ${keys}
      <rect x="134" y="292" width="212" height="8" rx="4" fill="${a}" opacity=".28"/>
    </g>`;
  };

  S.mouse = (a) => `
    <g>
      <path d="M240 118c45 0 68 40 68 96s-23 92-68 92-68-36-68-92 23-96 68-96z" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2" transform="rotate(-8 240 212)"/>
      <path d="M240 130v62" stroke="${a}" stroke-opacity=".45" stroke-width="3"/>
      <rect x="232" y="144" width="16" height="34" rx="8" fill="${a}" opacity=".5"/>
      <ellipse cx="240" cy="320" rx="96" ry="14" fill="${a}" opacity=".14" filter="url(#soft)"/>
    </g>`;

  S.headphones = (a) => `
    <g>
      <path d="M152 266v-34a88 88 0 0 1 176 0v34" fill="none" stroke="url(#metal)" stroke-width="24" stroke-linecap="round"/>
      <path d="M152 266v-34a88 88 0 0 1 176 0v34" fill="none" stroke="${a}" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>
      <rect x="118" y="238" width="62" height="112" rx="28" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="300" y="238" width="62" height="112" rx="28" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="149" cy="292" r="16" fill="${a}" opacity=".4"/>
      <circle cx="331" cy="292" r="16" fill="${a}" opacity=".4"/>
    </g>`;

  S.earbuds = (a) => `
    <g>
      <rect x="150" y="206" width="180" height="120" rx="34" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <path d="M150 246h180" stroke="${a}" stroke-opacity=".2"/>
      <g transform="translate(186 146)">
        <circle cx="26" cy="26" r="26" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
        <rect x="18" y="42" width="16" height="50" rx="8" fill="url(#metal)" stroke="${a}" stroke-opacity=".28"/>
        <circle cx="26" cy="26" r="9" fill="${a}" opacity=".45"/>
      </g>
      <g transform="translate(268 146)">
        <circle cx="26" cy="26" r="26" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
        <rect x="18" y="42" width="16" height="50" rx="8" fill="url(#metal)" stroke="${a}" stroke-opacity=".28"/>
        <circle cx="26" cy="26" r="9" fill="${a}" opacity=".45"/>
      </g>
    </g>`;

  S.speaker = (a) => `
    <g>
      <rect x="158" y="112" width="164" height="272" rx="72" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="176" y="132" width="128" height="196" rx="60" fill="${a}" opacity=".14"/>
      <circle cx="240" cy="212" r="46" fill="none" stroke="${a}" stroke-opacity=".5" stroke-width="3"/>
      <circle cx="240" cy="212" r="22" fill="${a}" opacity=".45"/>
      <rect x="214" y="320" width="52" height="8" rx="4" fill="${a}" opacity=".5"/>
    </g>`;

  S.smartwatch = (a) => `
    <g>
      <rect x="198" y="72" width="84" height="96" rx="26" fill="${a}" opacity=".35"/>
      <rect x="198" y="324" width="84" height="96" rx="26" fill="${a}" opacity=".35"/>
      <rect x="178" y="146" width="124" height="200" rx="46" fill="url(#metal)" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <rect x="190" y="158" width="100" height="176" rx="38" fill="url(#screen)"/>
      <circle cx="240" cy="228" r="30" fill="none" stroke="${a}" stroke-width="5" stroke-opacity=".8"/>
      <circle cx="240" cy="228" r="30" fill="none" stroke="#fff" stroke-width="5" stroke-opacity=".15" stroke-dasharray="70 120"/>
      <rect x="212" y="270" width="56" height="7" rx="3.5" fill="#fff" opacity=".2"/>
      <rect x="222" y="286" width="36" height="6" rx="3" fill="#fff" opacity=".12"/>
      <circle cx="300" cy="200" r="6" fill="${a}"/>
    </g>`;

  S.band = (a) => `
    <g transform="rotate(-8 240 240)">
      <rect x="212" y="82" width="56" height="90" rx="24" fill="${a}" opacity=".35"/>
      <rect x="212" y="316" width="56" height="90" rx="24" fill="${a}" opacity=".35"/>
      <rect x="196" y="158" width="88" height="168" rx="38" fill="url(#metal)" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <rect x="206" y="168" width="68" height="148" rx="30" fill="url(#screen)"/>
      <path d="M240 206v34h22" stroke="${a}" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>`;

  S.glasses = (a) => `
    <g>
      <path d="M110 208h58M312 208h58" stroke="url(#metal)" stroke-width="12" stroke-linecap="round"/>
      <rect x="150" y="182" width="74" height="52" rx="18" fill="url(#screen)" stroke="${a}" stroke-width="3" stroke-opacity=".55"/>
      <rect x="256" y="182" width="74" height="52" rx="18" fill="url(#screen)" stroke="${a}" stroke-width="3" stroke-opacity=".55"/>
      <path d="M224 200q16-10 32 0" stroke="${a}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="187" cy="208" r="14" fill="${a}" opacity=".35"/>
      <circle cx="293" cy="208" r="14" fill="${a}" opacity=".35"/>
    </g>`;

  S.tracker = (a) => `
    <g>
      <circle cx="240" cy="240" r="92" fill="${a}" opacity=".12"/>
      <circle cx="240" cy="240" r="66" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="240" cy="240" r="26" fill="${a}" opacity=".5"/>
      <path d="M240 214v52" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>
    </g>`;

  S.gamepad = (a) => `
    <g>
      <path d="M150 186h180q40 0 48 52l12 68q6 34-24 36-22 2-38-18l-24-26h-128l-24 26q-16 20-38 18-30-2-24-36l12-68q8-52 48-52z"
            fill="url(#metal)" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <circle cx="186" cy="242" r="20" fill="${a}" opacity=".3"/>
      <circle cx="186" cy="242" r="9" fill="${a}" opacity=".7"/>
      <rect x="276" y="222" width="16" height="38" rx="7" fill="${a}" opacity=".55"/>
      <rect x="265" y="233" width="38" height="16" rx="7" fill="${a}" opacity=".55"/>
      <circle cx="316" cy="264" r="12" fill="${a}" opacity=".45"/>
      <circle cx="290" cy="276" r="12" fill="${a}" opacity=".45"/>
      <circle cx="240" cy="212" r="13" fill="${a}" opacity=".6"/>
    </g>`;

  S.console = (a) => `
    <g>
      <path d="M176 116q-16 0-16 18v212q0 18 16 18h18q16 0 16-18V134q0-18-16-18z" fill="url(#metal)" stroke="${a}" stroke-opacity=".3"/>
      <path d="M238 104q-20 0-20 22v234q0 22 20 22h12q22 0 22-22V154q0-24-14-50z" fill="url(#metal)" stroke="${a}" stroke-opacity=".3"/>
      <path d="M286 140h18q16 0 16 18v190q0 18-16 18h-18z" fill="${a}" opacity=".25"/>
      <circle cx="284" cy="290" r="7" fill="${a}" opacity=".7"/>
      <rect x="286" y="264" width="34" height="5" rx="2.5" fill="${a}" opacity=".5"/>
    </g>`;

  S.xbox = (a) => `
    <g>
      <rect x="152" y="150" width="176" height="196" rx="26" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="240" cy="224" r="48" fill="${a}" opacity=".3"/>
      <path d="M212 200q28-18 56 0" stroke="${a}" stroke-width="4" fill="none" opacity=".7"/>
      <path d="M212 252q28 18 56 0" stroke="${a}" stroke-width="4" fill="none" opacity=".7"/>
      <rect x="182" y="302" width="116" height="10" rx="5" fill="${a}" opacity=".3"/>
      <circle cx="240" cy="326" r="5" fill="${a}" opacity=".6"/>
    </g>`;

  S.nintendo = (a) => `
    <g>
      <rect x="146" y="132" width="188" height="216" rx="18" fill="${a}" opacity=".22" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <rect x="196" y="132" width="88" height="216" rx="8" fill="url(#screen)"/>
      <rect x="150" y="132" width="42" height="216" rx="18" fill="${a}" opacity=".65"/>
      <rect x="288" y="132" width="42" height="216" rx="18" fill="${a}" opacity=".65"/>
      <circle cx="171" cy="196" r="9" fill="#fff" opacity=".6"/>
      <circle cx="309" cy="250" r="9" fill="#fff" opacity=".6"/>
      <circle cx="240" cy="240" r="26" fill="${a}" opacity=".25"/>
    </g>`;

  S.chair = (a) => `
    <g>
      <rect x="168" y="104" width="128" height="176" rx="42" fill="url(#metal)" stroke="${a}" stroke-opacity=".3" stroke-width="2"/>
      <path d="M192 160h80M192 196h80M192 232h80" stroke="${a}" stroke-opacity=".28" stroke-width="6" stroke-linecap="round"/>
      <rect x="154" y="268" width="164" height="44" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".3"/>
      <path d="M240 312v34" stroke="${a}" stroke-width="10"/>
      <path d="M176 372l64-26 64 26" stroke="url(#metal)" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="176" cy="374" r="9" fill="${a}"/><circle cx="304" cy="374" r="9" fill="${a}"/>
      <circle cx="240" cy="352" r="9" fill="${a}"/>
    </g>`;

  S.vr = (a) => `
    <g>
      <rect x="132" y="176" width="216" height="120" rx="46" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="164" y="196" width="72" height="54" rx="20" fill="url(#screen)"/>
      <rect x="244" y="196" width="72" height="54" rx="20" fill="url(#screen)"/>
      <path d="M148 176q-26-8-26-34t26-34" stroke="${a}" fill="none" stroke-width="8" stroke-opacity=".5"/>
      <path d="M332 176q26-8 26-34t-26-34" stroke="${a}" fill="none" stroke-width="8" stroke-opacity=".5"/>
      <circle cx="186" cy="223" r="12" fill="${a}" opacity=".5"/>
      <circle cx="266" cy="223" r="12" fill="${a}" opacity=".5"/>
    </g>`;

  S.camera = (a) => `
    <g>
      <rect x="132" y="170" width="216" height="150" rx="22" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="164" y="146" width="70" height="30" rx="10" fill="url(#metal)" stroke="${a}" stroke-opacity=".25"/>
      <circle cx="238" cy="246" r="62" fill="#15172B" opacity=".9"/>
      <circle cx="238" cy="246" r="48" fill="none" stroke="${a}" stroke-width="4" stroke-opacity=".6"/>
      <circle cx="238" cy="246" r="28" fill="${a}" opacity=".45"/>
      <circle cx="220" cy="228" r="10" fill="#fff" opacity=".25"/>
      <circle cx="312" cy="196" r="9" fill="${a}" opacity=".7"/>
      <rect x="150" y="182" width="26" height="12" rx="6" fill="${a}" opacity=".4"/>
    </g>`;

  S.camcorder = (a) => `
    <g>
      <rect x="118" y="176" width="140" height="112" rx="20" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="246" y="196" width="104" height="72" rx="16" fill="${a}" opacity=".25"/>
      <circle cx="322" cy="232" r="30" fill="#15172B" opacity=".9"/>
      <circle cx="322" cy="232" r="16" fill="${a}" opacity=".55"/>
      <rect x="146" y="200" width="52" height="34" rx="8" fill="url(#screen)"/>
      <rect x="138" y="150" width="44" height="30" rx="10" fill="${a}" opacity=".35"/>
      <circle cx="200" cy="150" r="12" fill="${a}" opacity=".4"/>
    </g>`;

  S.actioncam = (a) => `
    <g>
      <rect x="150" y="176" width="180" height="132" rx="24" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="240" cy="242" r="46" fill="#15172B" opacity=".9"/>
      <circle cx="240" cy="242" r="30" fill="${a}" opacity=".5"/>
      <circle cx="226" cy="228" r="9" fill="#fff" opacity=".3"/>
      <rect x="168" y="192" width="30" height="16" rx="6" fill="${a}" opacity=".45"/>
      <rect x="288" y="196" width="24" height="10" rx="5" fill="${a}" opacity=".5"/>
      <path d="M180 308v22M300 308v22" stroke="${a}" stroke-width="6" stroke-opacity=".4"/>
    </g>`;

  S.securitycam = (a) => `
    <g>
      <rect x="206" y="112" width="28" height="70" rx="10" fill="url(#metal)"/>
      <rect x="140" y="180" width="200" height="104" rx="52" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="300" cy="232" r="46" fill="#15172B" opacity=".92"/>
      <circle cx="300" cy="232" r="28" fill="${a}" opacity=".5"/>
      <circle cx="286" cy="218" r="8" fill="#fff" opacity=".3"/>
      <path d="M190 232h40" stroke="${a}" stroke-width="6" stroke-linecap="round" opacity=".5"/>
      <circle cx="240" cy="140" r="8" fill="${a}" opacity=".6"/>
    </g>`;

  S.lens = (a) => `
    <g transform="rotate(-12 240 240)">
      <rect x="164" y="132" width="152" height="216" rx="26" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="176" y="150" width="128" height="42" rx="14" fill="${a}" opacity=".3"/>
      <circle cx="240" cy="286" r="44" fill="#15172B" opacity=".9"/>
      <circle cx="240" cy="286" r="30" fill="${a}" opacity=".45"/>
      <circle cx="240" cy="286" r="14" fill="#fff" opacity=".18"/>
      <rect x="196" y="204" width="88" height="10" rx="5" fill="${a}" opacity=".4"/>
    </g>`;

  S.tripod = (a) => `
    <g>
      <rect x="228" y="120" width="24" height="60" rx="10" fill="url(#metal)"/>
      <circle cx="240" cy="120" r="20" fill="${a}" opacity=".35"/>
      <path d="M240 180v80" stroke="url(#metal)" stroke-width="16"/>
      <path d="M240 250l-74 122M240 250l74 122M240 250v104" stroke="url(#metal)" stroke-width="14" stroke-linecap="round"/>
      <circle cx="240" cy="250" r="18" fill="${a}" opacity=".45"/>
    </g>`;

  S.lighting = (a) => `
    <g>
      <rect x="150" y="118" width="180" height="140" rx="12" fill="url(#screen)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <path d="M168 236l38-104M204 236l38-104M240 236l38-104" stroke="#fff" stroke-opacity=".2" stroke-width="6" stroke-linecap="round"/>
      <rect x="228" y="258" width="24" height="70" rx="8" fill="url(#metal)"/>
      <path d="M240 328v52M180 396l60-68 60 68" stroke="url(#metal)" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="240" cy="188" r="26" fill="${a}" opacity=".35"/>
    </g>`;

  S.tv = (a) => `
    <g>
      <rect x="72" y="116" width="336" height="196" rx="14" fill="url(#metal)" stroke="${a}" stroke-opacity=".3" stroke-width="2"/>
      <rect x="82" y="126" width="316" height="176" rx="6" fill="url(#screen)"/>
      <path d="M110 280l90-110v110z" fill="${a}" opacity=".18"/>
      <circle cx="240" cy="214" r="34" fill="${a}" opacity=".22"/>
      <path d="M190 326h100l10 26h-120z" fill="url(#metal)"/>
      <rect x="156" y="352" width="168" height="10" rx="5" fill="url(#metal)" stroke="${a}" stroke-opacity=".2"/>
      <circle cx="388" cy="304" r="4" fill="${a}" opacity=".8"/>
    </g>`;

  S.projector = (a) => `
    <g>
      <rect x="124" y="168" width="232" height="150" rx="28" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="208" cy="243" r="46" fill="#15172B" opacity=".9"/>
      <circle cx="208" cy="243" r="28" fill="${a}" opacity=".5"/>
      <circle cx="208" cy="243" r="11" fill="#fff" opacity=".25"/>
      <rect x="272" y="206" width="58" height="10" rx="5" fill="${a}" opacity=".45"/>
      <rect x="272" y="226" width="40" height="8" rx="4" fill="${a}" opacity=".3"/>
      <circle cx="316" cy="278" r="7" fill="${a}" opacity=".7"/>
      <path d="M124 264l-24 40M356 264l24 40" stroke="${a}" stroke-width="8" stroke-opacity=".35" stroke-linecap="round"/>
    </g>`;

  S.soundbar = (a) => `
    <g>
      <rect x="74" y="206" width="332" height="86" rx="30" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="94" y="226" width="292" height="46" rx="22" fill="${a}" opacity=".14"/>
      <circle cx="150" cy="249" r="16" fill="${a}" opacity=".45"/>
      <circle cx="240" cy="249" r="16" fill="${a}" opacity=".6"/>
      <circle cx="330" cy="249" r="16" fill="${a}" opacity=".45"/>
      <path d="M120 292v26M360 292v26" stroke="${a}" stroke-width="7" stroke-opacity=".3"/>
    </g>`;

  S.theater = (a) => `
    <g>
      <rect x="80" y="152" width="320" height="60" rx="20" fill="url(#metal)" stroke="${a}" stroke-opacity=".3"/>
      <circle cx="120" cy="182" r="10" fill="${a}" opacity=".5"/>
      <circle cx="240" cy="182" r="10" fill="${a}" opacity=".6"/>
      <circle cx="360" cy="182" r="10" fill="${a}" opacity=".5"/>
      <rect x="118" y="236" width="74" height="130" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".3"/>
      <rect x="288" y="236" width="74" height="130" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".3"/>
      <circle cx="155" cy="282" r="18" fill="${a}" opacity=".4"/>
      <circle cx="325" cy="282" r="18" fill="${a}" opacity=".4"/>
      <circle cx="155" cy="330" r="12" fill="${a}" opacity=".3"/>
      <circle cx="325" cy="330" r="12" fill="${a}" opacity=".3"/>
    </g>`;

  S.vacuum = (a) => `
    <g transform="rotate(-8 240 246)">
      <rect x="208" y="96" width="64" height="140" rx="24" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="222" y="112" width="36" height="56" rx="14" fill="${a}" opacity=".4"/>
      <circle cx="240" cy="200" r="14" fill="${a}" opacity=".6"/>
      <path d="M240 236v90" stroke="url(#metal)" stroke-width="20" stroke-linecap="round"/>
      <rect x="176" y="322" width="128" height="44" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="192" y="352" width="96" height="8" rx="4" fill="${a}" opacity=".45"/>
    </g>`;

  S.purifier = (a) => `
    <g>
      <rect x="158" y="122" width="164" height="264" rx="32" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="178" y="150" width="124" height="52" rx="14" fill="${a}" opacity=".22"/>
      <path d="M196 174h88" stroke="${a}" stroke-width="4" stroke-linecap="round" stroke-opacity=".7"/>
      <path d="M190 236h100M190 258h100M190 280h100M190 302h100" stroke="${a}" stroke-width="5" stroke-linecap="round" stroke-opacity=".22"/>
      <circle cx="240" cy="344" r="10" fill="${a}" opacity=".6"/>
      <path d="M330 220q22-12 22-34" stroke="${a}" stroke-width="5" fill="none" stroke-opacity=".35"/>
    </g>`;

  S.kitchen = (a) => `
    <g>
      <path d="M140 218q0-64 100-64t100 64v112q0 24-24 24H164q-24 0-24-24z" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="182" y="182" width="116" height="42" rx="18" fill="url(#screen)"/>
      <path d="M204 258h72" stroke="${a}" stroke-width="8" stroke-linecap="round" stroke-opacity=".4"/>
      <rect x="222" y="292" width="36" height="24" rx="8" fill="${a}" opacity=".45"/>
      <path d="M244 96h14q16 0 16 16v18" stroke="${a}" stroke-width="8" fill="none" stroke-linecap="round" stroke-opacity=".5"/>
    </g>`;

  S.router = (a) => `
    <g>
      <path d="M168 196l-30-96M240 190V84M312 196l30-96" stroke="url(#metal)" stroke-width="10" stroke-linecap="round"/>
      <circle cx="138" cy="100" r="7" fill="${a}" opacity=".7"/>
      <circle cx="240" cy="84" r="7" fill="${a}" opacity=".7"/>
      <circle cx="342" cy="100" r="7" fill="${a}" opacity=".7"/>
      <rect x="118" y="192" width="244" height="94" rx="26" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <path d="M150 232h180" stroke="${a}" stroke-width="6" stroke-linecap="round" stroke-opacity=".2"/>
      <circle cx="180" cy="262" r="8" fill="${a}" opacity=".7"/>
      <circle cx="212" cy="262" r="8" fill="${a}" opacity=".45"/>
      <circle cx="244" cy="262" r="8" fill="${a}" opacity=".3"/>
      <rect x="290" y="246" width="44" height="30" rx="8" fill="${a}" opacity=".25"/>
    </g>`;

  S.printer = (a) => `
    <g>
      <rect x="150" y="118" width="180" height="60" rx="8" fill="#fff" stroke="${a}" stroke-opacity=".25"/>
      <path d="M172 142h136M172 158h100" stroke="${a}" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>
      <rect x="128" y="172" width="224" height="112" rx="20" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="152" y="202" width="90" height="26" rx="8" fill="url(#screen)"/>
      <rect x="166" y="264" width="148" height="44" rx="12" fill="url(#metal)" stroke="${a}" stroke-opacity=".25"/>
      <circle cx="316" cy="206" r="8" fill="${a}" opacity=".6"/>
    </g>`;

  S.switchnet = (a) => `
    <g>
      <rect x="96" y="206" width="288" height="90" rx="16" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <g fill="${a}" opacity=".45">
        <rect x="118" y="236" width="26" height="30" rx="4"/>
        <rect x="150" y="236" width="26" height="30" rx="4"/>
        <rect x="182" y="236" width="26" height="30" rx="4"/>
        <rect x="214" y="236" width="26" height="30" rx="4"/>
        <rect x="246" y="236" width="26" height="30" rx="4"/>
        <rect x="278" y="236" width="26" height="30" rx="4"/>
        <rect x="310" y="236" width="26" height="30" rx="4"/>
      </g>
      <circle cx="354" cy="224" r="5" fill="#16A34A" opacity=".8"/>
      <circle cx="354" cy="240" r="5" fill="${a}" opacity=".6"/>
    </g>`;

  S.nas = (a) => `
    <g>
      <rect x="148" y="118" width="184" height="262" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <g fill="${a}" opacity=".22">
        <rect x="164" y="140" width="152" height="46" rx="8"/>
        <rect x="164" y="196" width="152" height="46" rx="8"/>
        <rect x="164" y="252" width="152" height="46" rx="8"/>
        <rect x="164" y="308" width="152" height="46" rx="8"/>
      </g>
      <g fill="${a}" opacity=".6">
        <circle cx="188" cy="163" r="4"/><circle cx="188" cy="219" r="4"/>
        <circle cx="188" cy="275" r="4"/><circle cx="188" cy="331" r="4"/>
      </g>
    </g>`;

  S.cpu = (a) => `
    <g>
      <rect x="158" y="158" width="164" height="164" rx="22" fill="url(#metal)" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <rect x="188" y="188" width="104" height="104" rx="12" fill="${a}" opacity=".22"/>
      <path d="M216 218h48M216 240h48M216 262h32" stroke="${a}" stroke-width="5" stroke-linecap="round" stroke-opacity=".6"/>
      <g stroke="${a}" stroke-width="5" stroke-opacity=".35" stroke-linecap="round">
        <path d="M182 142v16M212 142v16M242 142v16M272 142v16M302 142v16"/>
        <path d="M182 322v16M212 322v16M242 322v16M272 322v16M302 322v16"/>
        <path d="M142 182h16M142 212h16M142 242h16M142 272h16M142 302h16"/>
        <path d="M322 182h16M322 212h16M322 242h16M322 272h16M322 302h16"/>
      </g>
    </g>`;

  S.gpu = (a) => `
    <g>
      <rect x="86" y="168" width="308" height="140" rx="16" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="164" cy="238" r="44" fill="${a}" opacity=".16"/>
      <circle cx="164" cy="238" r="40" fill="none" stroke="${a}" stroke-width="4" stroke-opacity=".5"/>
      <circle cx="240" cy="238" r="44" fill="${a}" opacity=".16"/>
      <circle cx="240" cy="238" r="40" fill="none" stroke="${a}" stroke-width="4" stroke-opacity=".5"/>
      <circle cx="316" cy="238" r="44" fill="${a}" opacity=".16"/>
      <circle cx="316" cy="238" r="40" fill="none" stroke="${a}" stroke-width="4" stroke-opacity=".5"/>
      <rect x="86" y="296" width="308" height="14" rx="7" fill="${a}" opacity=".3"/>
      <rect x="86" y="300" width="60" height="30" rx="6" fill="${a}" opacity=".5"/>
    </g>`;

  S.ram = (a) => `
    <g transform="rotate(-10 240 240)">
      <rect x="92" y="192" width="296" height="96" rx="14" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <g fill="${a}" opacity=".3">
        <rect x="118" y="212" width="46" height="56" rx="6"/>
        <rect x="174" y="212" width="46" height="56" rx="6"/>
        <rect x="230" y="212" width="46" height="56" rx="6"/>
        <rect x="286" y="212" width="46" height="56" rx="6"/>
      </g>
      <path d="M92 282h296" stroke="${a}" stroke-width="8" stroke-opacity=".35"/>
    </g>`;

  S.ssd = (a) => `
    <g transform="rotate(-14 240 240)">
      <rect x="92" y="212" width="296" height="66" rx="12" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <g fill="${a}" opacity=".35">
        <rect x="112" y="226" width="40" height="38" rx="5"/>
        <rect x="160" y="226" width="40" height="38" rx="5"/>
        <rect x="208" y="226" width="40" height="38" rx="5"/>
      </g>
      <rect x="266" y="226" width="72" height="38" rx="6" fill="${a}" opacity=".55"/>
      <path d="M360 226h18v38h-18" fill="${a}" opacity=".35"/>
    </g>`;

  S.hdd = (a) => `
    <g>
      <rect x="148" y="148" width="184" height="184" rx="22" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <circle cx="240" cy="240" r="62" fill="${a}" opacity=".18"/>
      <circle cx="240" cy="240" r="14" fill="${a}" opacity=".6"/>
      <path d="M240 240l48-30" stroke="${a}" stroke-width="5" stroke-linecap="round" stroke-opacity=".6"/>
      <circle cx="282" cy="188" r="10" fill="${a}" opacity=".4"/>
    </g>`;

  S.motherboard = (a) => `
    <g>
      <rect x="120" y="118" width="240" height="240" rx="16" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="150" y="148" width="86" height="86" rx="10" fill="${a}" opacity=".22"/>
      <rect x="256" y="148" width="26" height="96" rx="6" fill="${a}" opacity=".35"/>
      <rect x="292" y="148" width="26" height="96" rx="6" fill="${a}" opacity=".35"/>
      <rect x="150" y="262" width="168" height="26" rx="6" fill="${a}" opacity=".3"/>
      <rect x="150" y="302" width="120" height="26" rx="6" fill="${a}" opacity=".22"/>
      <circle cx="312" cy="318" r="16" fill="${a}" opacity=".4"/>
    </g>`;

  S.cooler = (a) => `
    <g>
      <rect x="168" y="140" width="144" height="196" rx="14" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <circle cx="240" cy="220" r="52" fill="none" stroke="${a}" stroke-width="5" stroke-opacity=".5"/>
      <g stroke="${a}" stroke-width="10" stroke-opacity=".35" stroke-linecap="round">
        <path d="M196 162v34M212 156v46M228 162v34M244 156v46M260 162v34M276 156v46"/>
      </g>
      <path d="M204 348h72" stroke="${a}" stroke-width="10" stroke-linecap="round" stroke-opacity=".4"/>
    </g>`;

  S.psu = (a) => `
    <g>
      <rect x="132" y="160" width="216" height="160" rx="16" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <circle cx="240" cy="240" r="58" fill="none" stroke="${a}" stroke-width="5" stroke-opacity=".45"/>
      <circle cx="240" cy="240" r="30" fill="${a}" opacity=".3"/>
      <path d="M240 210v60M210 240h60" stroke="${a}" stroke-width="4" stroke-opacity=".4"/>
      <rect x="150" y="334" width="70" height="18" rx="6" fill="${a}" opacity=".3"/>
    </g>`;

  S.case = (a) => `
    <g>
      <rect x="146" y="104" width="188" height="284" rx="20" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <rect x="160" y="118" width="160" height="256" rx="14" fill="#15172B" opacity=".85"/>
      <circle cx="200" cy="176" r="16" fill="${a}" opacity=".5"/>
      <circle cx="240" cy="176" r="16" fill="${a}" opacity=".3"/>
      <rect x="176" y="228" width="128" height="10" rx="5" fill="${a}" opacity=".35"/>
      <rect x="176" y="250" width="128" height="10" rx="5" fill="${a}" opacity=".22"/>
      <rect x="176" y="300" width="64" height="10" rx="5" fill="${a}" opacity=".3"/>
    </g>`;

  S.webcam = (a) => `
    <g>
      <rect x="152" y="150" width="176" height="120" rx="46" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <circle cx="240" cy="210" r="40" fill="#15172B" opacity=".92"/>
      <circle cx="240" cy="210" r="24" fill="${a}" opacity=".5"/>
      <circle cx="230" cy="200" r="7" fill="#fff" opacity=".3"/>
      <path d="M200 270v24q0 16 16 16h48q16 0 16-16v-24" fill="url(#metal)" stroke="${a}" stroke-opacity=".25"/>
      <path d="M240 310v34" stroke="${a}" stroke-width="8" stroke-opacity=".4"/>
    </g>`;

  S.mic = (a) => `
    <g>
      <rect x="204" y="104" width="72" height="150" rx="36" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <g stroke="${a}" stroke-width="3" stroke-opacity=".35">
        <path d="M214 130h52M214 150h52M214 170h52M214 190h52M214 210h52"/>
      </g>
      <path d="M180 220q0 60 60 60t60-60" fill="none" stroke="${a}" stroke-width="7" stroke-opacity=".55"/>
      <path d="M240 280v48" stroke="${a}" stroke-width="8" stroke-opacity=".55"/>
      <path d="M180 356h120" stroke="url(#metal)" stroke-width="14" stroke-linecap="round"/>
    </g>`;

  S.powerbank = (a) => `
    <g>
      <rect x="168" y="120" width="144" height="240" rx="32" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <path d="M232 168l-20 40h22l-12 38 40-52h-24l14-26z" fill="${a}" opacity=".6"/>
      <rect x="196" y="290" width="88" height="10" rx="5" fill="${a}" opacity=".25"/>
      <circle cx="212" cy="322" r="5" fill="${a}"/><circle cx="232" cy="322" r="5" fill="${a}"/>
      <circle cx="252" cy="322" r="5" fill="${a}"/><circle cx="272" cy="322" r="5" fill="${a}" opacity=".3"/>
    </g>`;

  S.charger = (a) => `
    <g>
      <rect x="186" y="150" width="128" height="140" rx="28" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <path d="M214 150v-40M286 150v-40" stroke="url(#metal)" stroke-width="10" stroke-linecap="round"/>
      <rect x="228" y="214" width="44" height="16" rx="6" fill="${a}" opacity=".5"/>
      <rect x="228" y="244" width="44" height="12" rx="6" fill="${a}" opacity=".3"/>
      <path d="M250 290v34q0 30 34 30h40" stroke="${a}" stroke-width="8" fill="none" stroke-opacity=".35" stroke-linecap="round"/>
    </g>`;

  S.cable = (a) => `
    <g>
      <path d="M132 168q88 0 88 72t88 72" fill="none" stroke="${a}" stroke-width="14" stroke-linecap="round" stroke-opacity=".55"/>
      <rect x="110" y="146" width="46" height="44" rx="10" fill="url(#metal)" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <rect x="290" y="292" width="46" height="44" rx="10" fill="url(#metal)" stroke="${a}" stroke-opacity=".4" stroke-width="2"/>
      <path d="M120 160v16M146 160v16" stroke="${a}" stroke-width="4"/>
    </g>`;

  S.hub = (a) => `
    <g>
      <rect x="118" y="192" width="244" height="104" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <g fill="${a}" opacity=".45">
        <rect x="142" y="222" width="38" height="16" rx="4"/>
        <rect x="142" y="250" width="38" height="16" rx="4"/>
        <rect x="192" y="222" width="38" height="16" rx="4"/>
        <rect x="192" y="250" width="38" height="16" rx="4"/>
      </g>
      <rect x="252" y="232" width="86" height="24" rx="12" fill="${a}" opacity=".3"/>
      <circle cx="330" cy="212" r="5" fill="#16A34A" opacity=".8"/>
    </g>`;

  S.stand = (a) => `
    <g>
      <path d="M124 300l72-152h128l-72 152z" fill="url(#metal)" stroke="${a}" stroke-opacity=".28"/>
      <path d="M136 292l66-136h56" stroke="${a}" stroke-opacity=".3" stroke-width="5" fill="none"/>
      <path d="M316 300l-40-40" stroke="${a}" stroke-width="10" stroke-opacity=".35"/>
      <rect x="100" y="300" width="248" height="16" rx="8" fill="${a}" opacity=".3"/>
    </g>`;

  S.bag = (a) => `
    <g>
      <rect x="136" y="168" width="208" height="160" rx="24" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <path d="M182 168v-22q0-24 24-24h68q24 0 24 24v22" fill="none" stroke="${a}" stroke-width="8" stroke-opacity=".45"/>
      <rect x="136" y="216" width="208" height="16" fill="${a}" opacity=".25"/>
      <rect x="214" y="240" width="52" height="26" rx="6" fill="${a}" opacity=".35"/>
    </g>`;

  S.cover = (a) => `
    <g>
      <rect x="168" y="118" width="144" height="252" rx="34" fill="${a}" opacity=".25" stroke="${a}" stroke-opacity=".5" stroke-width="3"/>
      <rect x="196" y="142" width="88" height="90" rx="26" fill="#fff" opacity=".35"/>
      <circle cx="226" cy="112" r="7" fill="${a}" opacity=".7"/>
      <circle cx="256" cy="112" r="7" fill="${a}" opacity=".7"/>
    </g>`;

  S.glass = (a) => `
    <g>
      <rect x="150" y="106" width="180" height="280" rx="34" fill="#fff" opacity=".75" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <rect x="166" y="122" width="148" height="248" rx="24" fill="${a}" opacity=".12"/>
      <path d="M166 208h148" stroke="${a}" stroke-width="2" stroke-opacity=".25"/>
      <circle cx="240" cy="128" r="4" fill="${a}"/>
    </g>`;

  S.stylus = (a) => `
    <g transform="rotate(18 240 240)">
      <rect x="216" y="96" width="40" height="212" rx="18" fill="url(#metal)" stroke="${a}" stroke-opacity=".35" stroke-width="2"/>
      <path d="M216 308h40l-20 46z" fill="${a}" opacity=".6"/>
      <rect x="222" y="130" width="28" height="10" rx="5" fill="${a}" opacity=".5"/>
    </g>`;

  S.generic = (a, l) => `
    <g>
      <rect x="146" y="146" width="188" height="188" rx="38" fill="url(#metal)" stroke="${a}" stroke-opacity=".32" stroke-width="2"/>
      <circle cx="240" cy="240" r="52" fill="${a}" opacity=".22"/>
      <path d="M240 204l32 36-32 36-32-36z" fill="${a}" opacity=".55"/>
    </g>`;

  /* ---- frame ------------------------------------------------------------ */
  function frame(kind, accent, variant = 0) {
    const a = accent || '#5B45E8';
    const l = light(a, 0.72);
    const d = dark(a, 0.32);
    const tint = mix(a, '#FFFFFF', 0.93);
    const shape = (S[kind] || S.generic)(a, l, d);
    const rotate = [[0, 0], [-3, 2], [4, -2]][variant % 3];
    const scale = [1, 1.08, 0.94][variant % 3];
    const bgId = 'b' + Math.random().toString(36).slice(2, 7);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480">
      <defs>
        <linearGradient id="bg${bgId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="${tint}"/>
        </linearGradient>
        <radialGradient id="glow${bgId}" cx="50%" cy="44%" r="52%">
          <stop offset="0" stop-color="${a}" stop-opacity=".28"/>
          <stop offset="1" stop-color="${a}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/>
          <stop offset=".42" stop-color="${l}"/>
          <stop offset="1" stop-color="${d}"/>
        </linearGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#252A45"/>
          <stop offset="1" stop-color="#121424"/>
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12"/>
        </filter>
        <pattern id="dots${bgId}" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="${a}" opacity=".16"/>
        </pattern>
      </defs>
      <rect width="480" height="480" fill="url(#bg${bgId})"/>
      <rect width="480" height="480" fill="url(#dots${bgId})"/>
      <circle cx="380" cy="96" r="126" fill="url(#glow${bgId})"/>
      <circle cx="96" cy="392" r="112" fill="${a}" opacity=".07"/>
      <ellipse cx="240" cy="398" rx="126" ry="22" fill="${a}" opacity=".16" filter="url(#soft)"/>
      <g transform="translate(240 240) rotate(${rotate}) scale(${scale}) translate(-240 -240)">
        ${shape}
      </g>
    </svg>`;
  }

  function toDataUri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim());
  }

  return {
    art(kind, accent, variant = 0) {
      return toDataUri(frame(kind, accent, variant));
    },
    product(product, variant = 0) {
      return toDataUri(frame(product.art || 'generic', product.accent || '#5B45E8', variant));
    },
    kinds: Object.keys(S)
  };
})();
