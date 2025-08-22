import { createAddressAvatar, shortenAddress, tokenManager } from '@gaiaprotocol/client-common';
import { ElementType, GenderType } from '@gaiaprotocol/god-mode-shared';
import { createNftAttributeEditor } from '@gaiaprotocol/nft-attribute-editor';
import { el } from '@webtaku/el';
import { saveNftAttributes } from '../api/god-metadata';
import { fetchNftDetail, NftDetail } from '../api/nfts';
import { showErrorAlert } from '../components/alert';
import { createGodViewer } from '../components/god-viewer';
import fireManParts from '../data/fire-man-parts.json' with { type: 'json' };
import fireWomanParts from '../data/fire-woman-parts.json' with { type: 'json' };
import keyToFrame from '../data/key-to-frame.json' with { type: 'json' };
import { getMyAddress } from './shared';
import spritesheet from '../data/spritesheet.json' with { type: 'json' };
import stoneManParts from '../data/stone-man-parts.json' with { type: 'json' };
import stoneWomanParts from '../data/stone-woman-parts.json' with { type: 'json' };
import waterManParts from '../data/water-man-parts.json' with { type: 'json' };
import waterWomanParts from '../data/water-woman-parts.json' with { type: 'json' };

// 토스트 스택(최초 1회)
let toastStack = document.getElementById('toast-stack') as HTMLDivElement | null;
if (!toastStack) {
  toastStack = el('div', {
    id: 'toast-stack',
    style: `
        position: fixed; right: 16px; bottom: 16px; z-index: 9999;
        display: flex; flex-direction: column; gap: 8px;
      `
  }) as HTMLDivElement;
  document.body.append(toastStack);
}

function notify(variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger', message: string) {
  const a = document.createElement('sl-alert') as any;
  a.variant = variant;
  a.closable = true;
  a.duration = 3000;
  a.toast = true;          // Shoelace 토스트 스타일
  a.innerHTML = `
<sl-icon slot='icon' name='${variant === 'success' ? 'check2-circle' : variant === 'warning' ? 'exclamation-triangle' : 'info-circle'}'></sl-icon>
${message}
`;
  toastStack!.append(a);
  // .show()가 있는 버전에서는 show 호출
  (a.show?.() ?? (a.open = true));
}

// /god/:id 형태
function parsePath(): { id: string } | null {
  const parts = window.location.pathname.split('/').filter(Boolean); // ['god', ':id']
  if (parts[0] !== 'god' || !parts[1]) return null;
  return { id: decodeURIComponent(parts[1]) };
}

// ---- Auth gate --------------------------------------------------------------
function renderAuthRequired(root: HTMLElement) {
  root.innerHTML = '';
  const box = el('div', {
    style: `
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:12px; padding:48px 16px; text-align:center; border:1px dashed rgba(255,255,255,0.12);
      border-radius:16px; background:rgba(255,255,255,0.02);
    `
  });
  const title = el('h2', 'Sign-in required', { style: { fontSize: '18px', fontWeight: '600', margin: '0' } });
  const desc = el('p', 'Connect your wallet and complete the signature to view this God.', {
    style: { color: '#9CA3AF', margin: '0' }
  });
  const hint = el('p', 'Use the Connect button at the top-right, then complete the signature.', {
    style: { color: '#9CA3AF', margin: '0' }
  });
  box.append(title, desc, hint);
  root.append(box);
}

// ---- UI sections ------------------------------------------------------------
function headerBar(detail: NftDetail) {
  const wrap = el('div', {
    style: 'display:flex; align-items:center; justify-content:space-between; gap:12px;'
  });

  // Left: 'My Gods' (동일 스타일) + 서브
  const left = el('div', { style: 'display:flex; align-items:flex-start; gap:10px; min-width:0;' });
  const title = el('h1', 'My Gods', { style: { fontSize: '20px', fontWeight: '700', margin: '0' } });
  const sub = el(
    'div',
    el('span', `God #${detail.id}`, { style: 'opacity:.9' }),
    { style: 'font-size:12px; color:#9CA3AF; margin-top:2px;' }
  );
  const col = el('div'); col.append(title, sub);
  left.append(col);

  // Right: actions
  const right = el('div', { style: 'display:flex; gap:8px; align-items:center;' });
  const backBtn = el('sl-button', 'Back', {
    variant: 'default',
    onclick: () => {
      if (document.referrer && document.referrer.includes('/my-gods')) history.back();
      else window.location.assign('/my-gods');
    }
  });
  const explorerBtn = el('sl-button', 'View on Explorer', {
    variant: 'primary',
    onclick: () => {
      const url = `https://etherscan.io/nft/0x134590acb661da2b318bcde6b39ef5cf8208e372/${detail.id}`;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    },
  });
  right.append(backBtn, explorerBtn);

  wrap.append(left, right);
  return wrap;
}

function imagePanel(detail: NftDetail) {
  const card = el('div', {
    style: `
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      border-radius:16px; padding:10px;
    `
  });
  const viewer = createGodViewer({
    type: detail.traits!.Type as ElementType,
    gender: detail.traits!.Gender as GenderType,
    parts: detail.parts as { [category: string]: string },
  });
  viewer.style.borderRadius = '12px';
  card.append(viewer);
  return card;
}

function metaPanel(detail: NftDetail) {
  const wrap = el('div', { style: 'display:flex; flex-direction:column; gap:12px;' });

  const name = el('h2', detail.name ?? `God #${detail.id}`, {
    style: { fontSize: '18px', fontWeight: '600', margin: '0' }
  });

  const ownerRow = (() => {
    const owner = detail.holder as `0x${string}` | null | undefined;
    if (!owner) return null;
    const row = el('div', { style: 'display:flex; align-items:center; gap:8px; color:#9CA3AF;' });
    const avatar = createAddressAvatar(owner);
    Object.assign(avatar.style, { width: '18px', height: '18px', borderRadius: '9999px' });
    row.append(el('span', 'Owner:'), avatar, el('span', shortenAddress(owner)));
    return row;
  })();

  const desc = detail.description
    ? el('p', detail.description, { style: { color: '#d1d5db', margin: '6px 0 0 0' } })
    : null;

  // 공용: key-value 그리드
  const kvGrid = (title: string, entries: [string, string | number][]) => {
    if (!entries.length) return null;
    return el(
      'div',
      el('h3', title, { style: { fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' } }),
      el(
        'div',
        { style: 'display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px;' },
        ...entries.map(([k, v]) =>
          el(
            'div',
            el('div', String(k), { style: { fontSize: '11px', color: '#9CA3AF' } }),
            el('div', String(v ?? '-'), { style: { fontWeight: '600' } }),
            {
              style: `
                border:1px solid rgba(255,255,255,0.1);
                background:rgba(255,255,255,0.03);
                border-radius:12px; padding:10px;
              `
            }
          )
        )
      ),
      { style: 'display:flex; flex-direction:column; gap:8px;' }
    );
  };

  const traitEntries = Object.entries(detail.traits ?? {});
  const partEntries = Object.entries(detail.parts ?? {});

  const traitsGrid = kvGrid('Traits', traitEntries);
  const partsGrid = kvGrid('Parts', partEntries);

  const share = el('sl-button', 'Share', {
    variant: 'default',
    onclick: async () => {
      try { await navigator.clipboard.writeText(window.location.href); notify('success', 'Link copied'); }
      catch { notify('danger', 'Failed to copy link'); }
    }
  });
  const actions = el('div', share, { style: 'display:flex; gap:8px; margin-top:2px;' });

  wrap.append(name);
  if (ownerRow) wrap.append(ownerRow);
  if (desc) wrap.append(desc);
  if (traitsGrid) wrap.append(traitsGrid);
  if (partsGrid) wrap.append(partsGrid);
  wrap.append(actions);
  return wrap;
}

// ---- Page loader ------------------------------------------------------------
async function loadAndRender(root: HTMLElement) {
  const parsed = parsePath();
  root.innerHTML = '';

  if (!parsed) {
    root.append(
      el('div', 'Invalid URL. Expected /god/:id', {
        style: `
          padding:24px; border:1px dashed rgba(255,0,0,0.25);
          color: var(--sl-color-danger-600); border-radius:12px; text-align:center;
        `
      })
    );
    return;
  }

  if (!tokenManager.has() || !getMyAddress()) {
    renderAuthRequired(root);
    return;
  }

  const headerArea = el('div');
  const grid = el('div', { style: 'display:grid; grid-template-columns:1fr; gap:16px;' }) as HTMLDivElement;

  const mq = window.matchMedia('(min-width:1024px)');
  const apply = () => { grid.style.gridTemplateColumns = mq.matches ? '3fr 2fr' : '1fr'; };
  apply(); mq.addEventListener?.('change', apply);

  root.append(el('div', headerArea, grid, { style: 'display:flex; flex-direction:column; gap:16px;' }));

  // skeleton
  const loadingLeft = el('div', el('div', { class: 'aspect-square rounded-xl border border-white/10 bg-white/5 animate-pulse' }));
  const loadingRight = el('div',
    el('div', { class: 'h-6 w-56 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-4 w-72 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-4 w-64 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-4 w-40 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-10 w-full rounded-lg bg-white/10 animate-pulse', style: { marginTop: '8px' } }),
    el('div', { class: 'h-10 w-full rounded-lg bg-white/10 animate-pulse' }),
    { style: 'display:flex; flex-direction:column; gap:8px;' }
  );
  grid.append(loadingLeft, loadingRight);

  try {
    const detail = await fetchNftDetail(parsed.id);

    const header = headerBar(detail);
    headerArea.replaceWith(header);

    grid.innerHTML = '';
    const leftCol = imagePanel(detail);
    const rightCol = metaPanel(detail);
    grid.append(leftCol, rightCol);

    // --- 여기서부터 추가: 내가 소유한 경우 에디터 렌더 ---
    const you = getMyAddress();
    const own = you && detail.holder && you.toLowerCase() === detail.holder.toLowerCase();

    if (own) {
      // 에디터 카드(타이틀 + 마운트 + 푸터)
      const editorWrap = el('div', {
        style: `
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      border-radius:16px; padding:12px;
      display:flex; flex-direction:column; gap:12px;
      grid-column: 1 / -1; width: 100%;
    `
      });

      // 타이틀(상단)
      editorWrap.append(
        el('div', 'Edit Attributes', {
          style: 'font-size:14px; font-weight:600; opacity:.9;'
        })
      );

      // 에디터 마운트
      const editorMount = el('div', {
        style: `min-height:420px; height:600px; width:100%;`
      });
      editorWrap.append(editorMount);

      // 하단 버튼 행 (오른쪽 정렬)
      const footerRow = el('div', {
        style: 'display:flex; justify-content:flex-end; gap:8px;'
      });

      const resetBtn = el('sl-button', 'Reset', {
        variant: 'default',
        disabled: true as unknown as boolean
      });

      const saveBtn = el('sl-button', 'Save', {
        variant: 'primary',
        disabled: true as unknown as boolean
      });

      // Save
      saveBtn.addEventListener('click', async () => {
        try {
          (saveBtn as any).disabled = true;
          (saveBtn as any).loading = true;  // Shoelace 로딩 스피너

          await saveNftAttributes(detail.id, lastData);

          // 저장 성공 후 상태 초기화
          lastData = null;
          (resetBtn as any).disabled = true;
          notify('success', 'Attributes saved.');
        } catch (e) {
          console.error(e);
          notify('danger', e instanceof Error ? e.message : 'Failed to save. Please try again.');
          (saveBtn as any).disabled = false; // 실패 시 다시 활성화
        } finally {
          (saveBtn as any).loading = false;
        }
      });

      footerRow.append(resetBtn, saveBtn);
      editorWrap.append(footerRow);

      // 가로 전체로 펼쳐짐
      grid.append(editorWrap);

      // 에디터 생성
      const buildEditor = async (baseData: any) => {
        const comp = await createNftAttributeEditor({
          traitOptions: {
            Type: ['Stone', 'Fire', 'Water'],
            Gender: ['Man', 'Woman'],
          },
          partOptions: {
            Stone: { Man: stoneManParts, Woman: stoneWomanParts },
            Fire: { Man: fireManParts, Woman: fireWomanParts },
            Water: { Man: waterManParts, Woman: waterWomanParts },
          },
          baseData,
          keyToFrame,
          spritesheet,
          spritesheetImagePath: '/spritesheet.png',
        });
        Object.assign(comp.el.style, { width: '100%', height: '100%' });
        return comp;
      };

      const initialData = structuredClone(detail);
      let component = await buildEditor(initialData);
      editorMount.append(component.el);

      // 변경사항 추적
      let lastData: any = null;
      const onChanged = (data: any) => {
        lastData = data;
        (saveBtn as any).disabled = false;
        (resetBtn as any).disabled = false;

        window.dispatchEvent(new CustomEvent('god:attributesChanged', {
          detail: { id: detail.id, data }
        }));

        // --- 미리보기 즉시 반영 ---
        try {
          // 현재 편집 중 데이터(lastData)가 있다면 그것을, 없으면 컴포넌트의 최신 상태를 사용
          const next = data;

          // 왼쪽 미리보기 카드 안의 내용을 교체
          // imagePanel(detail)에서 만든 카드가 leftCol 변수에 들어있습니다.
          // 같은 케이스로 다시 만들거나, 기존 뷰어에 setProps가 있다면 그것을 사용합니다.
          const currentViewer = (leftCol.querySelector('[data-god-viewer="1"]') as HTMLElement | null);

          if (currentViewer && (currentViewer as any).__api?.setProps) {
            // 더 부드러운 갱신: 기존 뷰어 API 사용
            (currentViewer as any).__api.setProps({
              type: next.traits?.Type,
              gender: next.traits?.Gender,
              parts: next.parts,
            });
          } else {
            // 뷰어가 없다면 새로 생성
            leftCol.innerHTML = '';
            leftCol.append(
              createGodViewer({
                type: next.traits?.Type,
                gender: next.traits?.Gender,
                parts: next.parts,
              })
            );
          }
        } catch (e) {
          console.error(e);
        }
      };
      component.on('dataChanged', onChanged);

      // Reset: 초기 상태로 되돌림 (컴포넌트 재생성으로 확실히 복구)
      resetBtn.addEventListener('click', async () => {
        try {
          editorMount.innerHTML = '';
          component?.off?.('dataChanged', onChanged); // 지원 시 이벤트 언바인드
          component = await buildEditor(initialData);
          component.on('dataChanged', onChanged);
          editorMount.append(component.el);
          lastData = null;
          (saveBtn as any).disabled = true;
          (resetBtn as any).disabled = true;
          notify('neutral', 'Changes have been reset.');
        } catch (e) {
          console.error(e);
          notify('danger', 'Failed to reset.');
        }
      });
    }
  } catch (err) {
    console.error(err);
    grid.innerHTML = '';
    root.append(
      el('div', 'Failed to load this God. Please try again.', {
        style: `
          padding:24px; border:1px dashed rgba(255,0,0,0.25);
          color: var(--sl-color-danger-600); border-radius:12px; text-align:center;
        `
      })
    );
    showErrorAlert('Error', err instanceof Error ? err.message : String(err));
  }
}

// ---- Mount ------------------------------------------------------------------
(function mount() {
  const root = document.getElementById('god-detail-root');
  if (!root) return;

  loadAndRender(root);

  tokenManager.on('signedIn', () => loadAndRender(root));
  tokenManager.on('signedOut', () => loadAndRender(root));
})();
