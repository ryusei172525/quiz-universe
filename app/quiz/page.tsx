'use client';

import { useState, useEffect } from 'react';
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
};

const Quiz: React.FC = () => {
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

export default Quiz;
