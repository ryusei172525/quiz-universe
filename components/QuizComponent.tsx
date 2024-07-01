'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string; // 解説を追加
};

const quizQuestions: { [key: string]: Question[] } = {
  basic: [
    {
      question: '私たちの銀河の名前は何ですか？',
      options: ['アンドロメダ', '天の川', 'さんかく座', '渦巻銀河'],
      answer: '天の川',
      explanation: '天の川銀河は、私たちの太陽系が属する銀河です。',
    },
    {
      question: '光速はどれくらいですか？',
      options: ['300,000 km/s', '150,000 km/s', '1,000 km/s', '10,000 km/s'],
      answer: '300,000 km/s',
      explanation: '光速は約300,000キロメートル毎秒です。',
    },
  ],
  theory: [
    {
      question: 'ビッグバン理論とは何ですか？',
      options: [
        'ブラックホールに関する理論',
        '宇宙膨張に関する理論',
        'テレビ番組',
        '銀河形成に関する理論',
      ],
      answer: '宇宙膨張に関する理論',
      explanation: 'ビッグバン理論は、宇宙が約138億年前に膨張し始めたという理論です。',
    },
    {
      question: 'ホーキング放射とは何ですか？',
      options: [
        '星からの放射',
        'ブラックホールからの放射',
        '宇宙背景放射',
        'クエーサーからの放射',
      ],
      answer: 'ブラックホールからの放射',
      explanation: 'ホーキング放射は、ブラックホールがエネルギーを放出する現象です。',
    },
  ],
  observations: [
    {
      question: 'ハッブル宇宙望遠鏡の名前の由来は誰ですか？',
      options: [
        'アルバート・アインシュタイン',
        'エドウィン・ハッブル',
        'ニール・アームストロング',
        'ガリレオ・ガリレイ',
      ],
      answer: 'エドウィン・ハッブル',
      explanation: 'エドウィン・ハッブルは、宇宙が膨張していることを発見した天文学者です。',
    },
    {
      question: '赤方偏移は何を示しますか？',
      options: [
        '私たちに向かってくる物体',
        '私たちから遠ざかる物体',
        '色が変わる物体',
        '明るくなる物体',
      ],
      answer: '私たちから遠ざかる物体',
      explanation: '赤方偏移は、物体が私たちから遠ざかる際に光の波長が伸びる現象です。',
    },
  ],
  applied: [
    {
      question: 'ダークマターの存在を示す証拠として適切なのはどれですか？',
      options: [
        '宇宙背景放射',
        '銀河の回転曲線',
        '惑星の軌道',
        '彗星の尾',
      ],
      answer: '銀河の回転曲線',
      explanation: '銀河の回転曲線は、ダークマターの存在を示す重要な証拠の一つです。',
    },
    {
      question: '系外惑星に関する最近の発見は何ですか？',
      options: [
        'すべてが居住可能',
        'すべてがリングを持っている',
        '多くが大気を持っている',
        'すべてが岩石である',
      ],
      answer: '多くが大気を持っている',
      explanation: '最近の観測により、多くの系外惑星が大気を持っていることがわかりました。',
    },
  ],
  sed_dust: [
    {
      question: '銀河のスペクトルエネルギー分布 (SED) において、ダストは主にどのような役割を果たしますか？',
      options: [
        '星の形成を促進する',
        '放射を吸収し、長波長で再放射する',
        '銀河の速度を変える',
        '銀河の回転を制御する'
      ],
      answer: '放射を吸収し、長波長で再放射する',
      explanation: 'ダストは星からの放射を吸収し、そのエネルギーを主に赤外線で再放射します。'
    },
    {
      question: 'ダストは主にどのような星から生成されますか？',
      options: [
        '主系列星',
        '白色矮星',
        '超新星爆発と漸近巨星分枝星',
        '中性子星'
      ],
      answer: '超新星爆発と漸近巨星分枝星',
      explanation: 'ダストは主に超新星爆発 (SNe II) と漸近巨星分枝 (AGB) 星から生成されます。'
    },
    {
      question: 'ダストの質量とサイズ分布の進化を考慮しないと、SEDモデルにどのような影響が出ますか？',
      options: [
        '放射の強度が過小評価される',
        '放射の強度が過大評価される',
        '銀河の年齢が正しく見積もれない',
        'ダストの温度が不正確になる'
      ],
      answer: '銀河の年齢が正しく見積もれない',
      explanation: 'ダストの質量とサイズ分布の進化を考慮しないと、SEDの適切なフィッティングができず、銀河の年齢や進化段階の推定が誤る可能性があります。'
    },
    {
      question: '100 Myr の銀河には小さな粒子 (PAHs) が生成されない理由は何ですか？',
      options: [
        '銀河がまだ若く、ダストの形成が進んでいないから',
        '温度が高すぎるから',
        '星形成が活発でないから',
        '金属量が不足しているから'
      ],
      answer: '銀河がまだ若く、ダストの形成が進んでいないから',
      explanation: '銀河が若いため、ダストの形成が進んでおらず、PAHsがまだ生成されていません。'
    },
    {
      question: 'ダストの金属付着はどのようにしてダスト質量を増加させますか？',
      options: [
        '超新星爆発によって',
        '星形成によって',
        'ダスト粒子間の衝突によって',
        '金属がダスト粒子に付着することによって'
      ],
      answer: '金属がダスト粒子に付着することによって',
      explanation: 'ダストの金属付着は、ガス中の金属がダスト粒子に付着してダスト質量を増加させるプロセスです。'
    },
    {
      question: '銀河の年齢が1 Gyrを超えると、ダスト質量が急増する理由は何ですか？',
      options: [
        '銀河の中心にブラックホールが形成されるから',
        '星の寿命が尽きるから',
        'ダスト粒子が衝突して粉砕されるから',
        '金属付着が効果的になるから'
      ],
      answer: '金属付着が効果的になるから',
      explanation: '1 Gyrを超えると、金属付着が効果的になり、ダスト質量が急増します。'
    },
    {
      question: 'ダスト粒子が破砕されるプロセスは何と呼ばれますか？',
      options: [
        '破砕',
        '凝集',
        '蒸発',
        '融合'
      ],
      answer: '破砕',
      explanation: 'ダスト粒子が衝突して粉砕されるプロセスは「破砕」と呼ばれます。'
    },
    {
      question: 'ダストの進化を考慮したモデルが必要とされる理由は何ですか？',
      options: [
        '放射強度を正確に計算するため',
        '銀河の速度を測定するため',
        '星の形成率を予測するため',
        'ブラックホールの質量を測定するため'
      ],
      answer: '放射強度を正確に計算するため',
      explanation: 'ダストの進化を考慮することで、SEDモデルが銀河の放射強度をより正確に計算できます。'
    },
    {
      question: 'ダストの破壊は主にどのような天体現象によって引き起こされますか？',
      options: [
        '恒星風',
        '超新星ショック',
        '銀河の衝突',
        '中性子星の放射'
      ],
      answer: '超新星ショック',
      explanation: 'ダストの破壊は主に超新星ショックによって引き起こされます。'
    },
    {
      question: 'ダスト進化モデルにおいて、ダストのサイズ分布が重要な理由は何ですか？',
      options: [
        'ダストの化学組成を決定するため',
        'ダストの放射特性を決定するため',
        '銀河の質量を測定するため',
        '星形成率を予測するため'
      ],
      answer: 'ダストの放射特性を決定するため',
      explanation: 'ダストのサイズ分布は、その放射特性を決定し、SEDに影響を与えます。'
    },
  ],
  weak_lensing: [
    {
      question: '弱いレンズ効果 (WL) はなぜ銀河団の質量を推定するために有力な手法とされますか？',
      options: [
        '視線速度を測定できるから',
        'ダイナミックな性質に依存しないから',
        'X線放射を観測できるから',
        'ガスの冷却を考慮できるから'
      ],
      answer: 'ダイナミックな性質に依存しないから',
      explanation: 'WLは、視線速度やガスの冷却などのダイナミックな性質に依存せず、投影されたポテンシャルにのみ感度を持つため、銀河団の質量推定に有力です。'
    },
    {
      question: 'WL質量推定のバイアスは、合併銀河団においてなぜ深刻になると考えられますか？',
      options: [
        '銀河団の速度が変わるから',
        '合併によって構造が大きく変わるから',
        '銀河団の中心にブラックホールが形成されるから',
        '銀河団の年齢が増えるから'
      ],
      answer: '合併によって構造が大きく変わるから',
      explanation: '合併銀河団では、構成するハローが大きな構造変化を経験するため、モデルプロファイルからの逸脱が生じやすく、WL質量推定のバイアスが深刻になります。'
    },
    {
      question: '合併銀河団におけるWL質量バイアスの最大値はどの程度ですか？',
      options: [
        '約10%',
        '約20%',
        '約40%',
        '約60%'
      ],
      answer: '約60%',
      explanation: '2つの約10^15太陽質量の銀河団が衝突する場合、最大バイアスは約60%に達することが示されています。'
    },
    {
      question: 'NFWモデルはどのようにしてWL質量推定に影響を与えますか？',
      options: [
        '質量濃度関係を仮定する',
        '銀河団の速度を計算する',
        'ガスの冷却を考慮する',
        '銀河の年齢を推定する'
      ],
      answer: '質量濃度関係を仮定する',
      explanation: 'NFWモデルは、質量濃度関係を仮定することで、WL質量推定に使用されます。この関係はハローの平均的な性質を記述するためのものです。'
    },
    {
      question: '質量-濃度 (M–c) 関係は、どのような場合にバイアスを引き起こしますか？',
      options: [
        '視線速度が変わる場合',
        'ガスの冷却が進む場合',
        '銀河団が合併する場合',
        'ブラックホールが形成される場合'
      ],
      answer: '銀河団が合併する場合',
      explanation: 'M–c関係は、特に銀河団が合併する場合にバイアスを引き起こすことがあります。これは、合併によってハローの構造が大きく変わるためです。'
    },
    {
      question: '合併銀河団の中心の質量推定のバイアスはどのようにして減少させることができますか？',
      options: [
        '視線速度を正確に測定する',
        'ガスの冷却を考慮する',
        '真の濃度を事前に知る',
        'ブラックホールの質量を測定する'
      ],
      answer: '真の濃度を事前に知る',
      explanation: '真の濃度を独立した観測から得ることで、合併銀河団の中心の質量推定のバイアスを減少させることができます。'
    },
    {
      question: 'ガス速度発散マップを作成する目的は何ですか？',
      options: [
        '視線速度を測定するため',
        '衝撃波の位置を特定するため',
        'ガスの冷却を考慮するため',
        'ブラックホールの質量を測定するため'
      ],
      answer: '衝撃波の位置を特定するため',
      explanation: 'ガス速度発散マップを作成することで、合併銀河団における衝撃波の位置を特定することができます。'
    },
    {
      question: '合併銀河団の質量推定におけるバイアスの原因として重要なパラメータは何ですか？',
      options: [
        '視線速度',
        'ガスの冷却',
        'ハローの濃度',
        'ブラックホールの質量'
      ],
      answer: 'ハローの濃度',
      explanation: '合併銀河団の質量推定におけるバイアスの主な原因は、ハローの濃度の変化です。'
    },
    {
      question: '衝撃波ベースの時間推定は何に基づいて行われますか？',
      options: [
        '視線速度',
        'ガスの冷却速度',
        '衝撃波間の距離とウィリアル速度',
        'ブラックホールの活動'
      ],
      answer: '衝撃波間の距離とウィリアル速度',
      explanation: '衝撃波ベースの時間推定は、衝撃波間の距離とウィリアル速度に基づいて行われます。'
    },
    {
      question: '弱いレンズ効果の質量推定で二つのハローを同時にフィットする理由は何ですか？',
      options: [
        '視線速度を測定するため',
        'ハローの質量を正確に推定するため',
        'ガスの冷却を考慮するため',
        'ブラックホールの質量を測定するため'
      ],
      answer: 'ハローの質量を正確に推定するため',
      explanation: '二つのハローを同時にフィットすることで、弱いレンズ効果の質量推定の精度を向上させることができます。'
    },
    {
      question: '質量推定において、衝撃波の位置が重要な理由は何ですか？',
      options: [
        '視線速度を測定するため',
        'ガスの冷却を考慮するため',
        '合併の段階を特定するため',
        'ブラックホールの質量を測定するため'
      ],
      answer: '合併の段階を特定するため',
      explanation: '衝撃波の位置を特定することで、合併銀河団の段階を評価し、質量推定のバイアスを調整することができます。'
    },
    {
      question: '合併銀河団の質量推定における統計的不確実性の一般的なレベルはどれくらいですか？',
      options: [
        '約10%',
        '約20%',
        '約30%',
        '約50%'
      ],
      answer: '約50%',
      explanation: '合併銀河団の質量推定における統計的不確実性は一般的に約50%です。'
    },
    {
      question: '真の濃度を事前に知ることで、どの程度まで質量推定のバイアスを減少させることができますか？',
      options: [
        '約10%',
        '約20%',
        '約50%',
        'ほぼ完全に'
      ],
      answer: 'ほぼ完全に',
      explanation: '真の濃度を事前に知ることで、合併銀河団の質量推定のバイアスをほぼ完全に減少させることができます。'
    },
    {
      question: '衝撃波ベースの時間推定が有用である理由は何ですか？',
      options: [
        '視線速度を測定するため',
        'ガスの冷却を考慮するため',
        '合併の段階を評価するため',
        'ブラックホールの質量を測定するため'
      ],
      answer: '合併の段階を評価するため',
      explanation: '衝撃波ベースの時間推定は、観測データから直接アクセスできない合併の段階を評価するために有用です。'
    },
    {
      question: '合併銀河団におけるWL質量推定の最大バイアスが発生する時期はいつですか？',
      options: [
        '合併の初期段階',
        '合併の中間段階',
        '合併の後期段階',
        '合併の直前'
      ],
      answer: '合併の初期段階',
      explanation: 'WL質量推定の最大バイアスは、合併の初期段階（最初の遭遇後0.2〜0.4 Gyr）に発生します。'
    }
  ],
  clusters_dynamics: [
    {
      question: '銀河団の合併はなぜダークマターの自己相互作用断面積の制約に重要ですか？',
      options: [
        'ダークマターの速度を直接測定できるから',
        '合併速度と衝突後の時間に依存するから',
        'ダークマターの質量を増加させるから',
        '銀河団の年齢を正確に測定できるから'
      ],
      answer: '合併速度と衝突後の時間に依存するから',
      explanation: 'ダークマターの自己相互作用断面積は、合併速度と衝突後の時間に依存して推定されるため、正確な合併の動力学的特性を理解することが重要です。'
    },
    {
      question: 'Monte Carlo法を用いる理由は何ですか？',
      options: [
        '計算が高速であるため',
        '誤差伝播が容易であるため',
        '観測データが少ないため',
        'ダークマターの質量を直接測定できるため'
      ],
      answer: '誤差伝播が容易であるため',
      explanation: 'Monte Carlo法は、相関の高い多くの合併動力学パラメータの誤差伝播を容易にするため用いられます。'
    },
    {
      question: 'Bullet Clusterの合併に関する既存のN体シミュレーションとの比較で、どのパラメータが良好に一致しましたか？',
      options: [
        '速度',
        '衝突後の時間',
        '距離',
        '質量'
      ],
      answer: '速度',
      explanation: 'Bullet Clusterの合併に関する既存のN体シミュレーションとの比較で、速度の一致が良好であり、約4%の誤差で一致しました。'
    },
    {
      question: 'ダイナミカルフリクションの影響を無視することは、結果にどのように影響しますか？',
      options: [
        '質量推定が過小評価される',
        '速度推定が過大評価される',
        '速度推定にほとんど影響がない',
        '合併のタイミングが不正確になる'
      ],
      answer: '速度推定にほとんど影響がない',
      explanation: 'ダイナミカルフリクションの影響を無視しても、速度推定にほとんど影響がないことが示されています。'
    },
    {
      question: 'この研究で検討された主要な銀河団の2つの例は何ですか？',
      options: [
        'Bullet ClusterとMusket Ball Cluster',
        'Coma ClusterとVirgo Cluster',
        'Perseus ClusterとFornax Cluster',
        'Hercules ClusterとCentaurus Cluster'
      ],
      answer: 'Bullet ClusterとMusket Ball Cluster',
      explanation: 'この研究で検討された主要な銀河団の2つの例は、Bullet ClusterとMusket Ball Clusterです。'
    },
    {
      question: 'NFWモデルは何を仮定していますか？',
      options: [
        'ハローの質量が時間と共に増加する',
        'ハローの質量と濃度が一定である',
        'ハローの速度が一定である',
        'ハローの温度が一定である'
      ],
      answer: 'ハローの質量と濃度が一定である',
      explanation: 'NFWモデルは、ハローの質量と濃度が一定であることを仮定しています。'
    },
    {
      question: '合併銀河団の観測される主要な動力学パラメータは何ですか？',
      options: [
        '赤方偏移と質量',
        '距離と温度',
        '速度と密度',
        '回転速度とガス量'
      ],
      answer: '赤方偏移と質量',
      explanation: '合併銀河団の観測される主要な動力学パラメータは、赤方偏移と質量です。'
    },
    {
      question: 'Bullet Clusterにおける衝突後の時間 (TSC) の推定はどのように行われましたか？',
      options: [
        '速度測定のみを用いて推定',
        'N体シミュレーションのみを用いて推定',
        '観測データとMonte Carlo法を組み合わせて推定',
        '赤方偏移のみを用いて推定'
      ],
      answer: '観測データとMonte Carlo法を組み合わせて推定',
      explanation: 'Bullet Clusterにおける衝突後の時間 (TSC) の推定は、観測データとMonte Carlo法を組み合わせて行われました。'
    },
    {
      question: 'Musket Ball ClusterはBullet Clusterと比較してどのような特徴を持っていますか？',
      options: [
        '速度が遅く、合併が進んでいる',
        '速度が速く、合併が進んでいない',
        '質量が大きく、赤方偏移が小さい',
        '質量が小さく、赤方偏移が大きい'
      ],
      answer: '速度が遅く、合併が進んでいる',
      explanation: 'Musket Ball Clusterは、速度が遅く、合併がBullet Clusterよりも進んでいることが特徴です。'
    },
    {
      question: 'X線衝撃波は何を推定するために用いられますか？',
      options: [
        '衝突速度',
        'ガスの密度',
        'ダークマターの質量',
        '銀河団の年齢'
      ],
      answer: '衝突速度',
      explanation: 'X線衝撃波は、銀河団の衝突速度を推定するために用いられます。'
    },
    {
      question: 'Monte Carlo法の利点は何ですか？',
      options: [
        '計算が高速',
        '誤差が少ない',
        '追加の制約を容易に組み込める',
        'シンプルなモデルである'
      ],
      answer: '追加の制約を容易に組み込める',
      explanation: 'Monte Carlo法の利点は、追加の制約を容易に組み込めることです。'
    },
    {
      question: '合併銀河団の動力学的特性は、どのようにダークマターの性質に影響しますか？',
      options: [
        'ダークマターの形成率を変える',
        'ダークマターの分布を変える',
        'ダークマターの自己相互作用断面積の制約を提供する',
        'ダークマターの速度を変える'
      ],
      answer: 'ダークマターの自己相互作用断面積の制約を提供する',
      explanation: '合併銀河団の動力学的特性は、ダークマターの自己相互作用断面積の制約を提供します。'
    },
    {
      question: '衝突後の時間 (TSC) が重要な理由は何ですか？',
      options: [
        '銀河の形成を促進する',
        'ダークマターと銀河のオフセットを決定する',
        '銀河団の速度を測定する',
        '銀河団の質量を推定する'
      ],
      answer: 'ダークマターと銀河のオフセットを決定する',
      explanation: '衝突後の時間 (TSC) は、ダークマターと銀河のオフセットを決定するために重要です。'
    },
    {
      question: 'この研究で検討された主要なダークマターの性質は何ですか？',
      options: [
        'ダークマターの質量',
        'ダークマターの速度',
        'ダークマターの自己相互作用断面積',
        'ダークマターの温度'
      ],
      answer: 'ダークマターの自己相互作用断面積',
      explanation: 'この研究で検討された主要なダークマターの性質は、ダークマターの自己相互作用断面積です。'
    },
    {
      question: 'Bullet Clusterの観測された赤方偏移はどのくらいですか？',
      options: [
        '0.1',
        '0.2',
        '0.3',
        '0.4'
      ],
      answer: '0.3',
      explanation: 'Bullet Clusterの観測された赤方偏移は約0.3です。'
    },
    {
      question: '合併銀河団の観測において、最大の不確実性は何に起因しますか？',
      options: [
        '質量の測定誤差',
        '赤方偏移の測定誤差',
        '衝突角度の不確実性',
        '速度の測定誤差'
      ],
      answer: '衝突角度の不確実性',
      explanation: '合併銀河団の観測において、最大の不確実性は衝突角度の不確実性に起因します。'
    }
  ],
  
};

const QuizComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showScore, setShowScore] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (category) {
      setQuestions(quizQuestions[category] || []);
    }
  }, [category]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
      setShowExplanation(false);
      setSelectedOption('');
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowScore(true);
      }
    } else {
      setShowExplanation(true);
    }
  };

  return (
    <div className="space-y-4"> {/* 隙間を追加 */}
      {showScore ? (
        <div className="card text-center">
          <h1 className="text-4xl mb-4">あなたのスコア: {score}</h1>
          <button onClick={() => router.push('/')}>ホームへ戻る</button>
        </div>
      ) : (
        <div className="card">
          <h1 className="text-2xl mb-4">{questions[currentQuestion]?.question}</h1>
          {questions[currentQuestion]?.options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="radio"
                id={`option${index}`}
                name="option"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                className="mr-2"
              />
              <label htmlFor={`option${index}`}>{option}</label>
            </div>
          ))}
          <button onClick={handleNextQuestion} className="mt-4">次へ</button>
          {showExplanation && (
            <div className="explanation">
              <p>{questions[currentQuestion]?.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
