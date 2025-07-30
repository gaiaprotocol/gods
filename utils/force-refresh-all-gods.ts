const API_KEY = 'a3e8f93d2b624b5b9e7d7364882a2bd6'; // OpenSea API 키를 여기에 넣으세요
const CHAIN = 'ethereum'; // 예: 'ethereum', 'polygon', 'base'
const CONTRACT_ADDRESS = '0x134590acb661da2b318bcde6b39ef5cf8208e372'; // 실제 컨트랙트 주소
const START_ID = 0;
const END_ID = 3332;

async function refreshNFT(id: number): Promise<void> {
  const url = `https://api.opensea.io/api/v2/chain/${CHAIN}/contract/${CONTRACT_ADDRESS}/nfts/${id}/refresh`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (res.ok) {
      console.log(`✅ ID ${id} refreshed (status ${res.status})`);
    } else {
      console.error(`❌ ID ${id} failed (status ${res.status})`);
    }
  } catch (error) {
    console.error(`🚨 ID ${id} error: ${(error as Error).message}`);
  }
}

async function main() {
  for (let id = START_ID; id <= END_ID; id++) {
    await refreshNFT(id);
    await new Promise(res => setTimeout(res, 300)); // 0.3초 delay to prevent rate limiting
  }
}

main();
