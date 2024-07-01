import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl mb-4">宇宙物理学クイズアプリへようこそ</h1>
      <p className="mb-8">カテゴリを選択してクイズを始めましょう:</p>
      <ul className="space-y-4">
        <li><Link href="/quiz?category=basic" className="block"><div className="card">基礎知識クイズ</div></Link></li>
        <li><Link href="/quiz?category=theory" className="block"><div className="card">理論とモデルクイズ</div></Link></li>
        <li><Link href="/quiz?category=observations" className="block"><div className="card">観測とデータクイズ</div></Link></li>
        <li><Link href="/quiz?category=applied" className="block"><div className="card">応用クイズ</div></Link></li>
        <li><Link href="/quiz?category=sed_dust" className="block"><div className="card">SEDとダスト進化クイズ(Nishida et al., 2022)</div></Link></li>
        <li><Link href="/quiz?category=weak_lensing" className="block"><div className="card">銀河団の弱重力レンズバイアス(Wonki Lee et al., 2023)</div></Link></li>
        <li><Link href="/quiz?category=clusters_dynamics" className="block"><div className="card">モンテカルロで解く銀河団の力学(Dawson William et al., 2013)</div></Link></li>

      </ul>
    </div>
  );
};

export default Home;
