import BiasBar from './BiasBar.jsx'
import ArticleCard from './ArticleCard.jsx'
import InfoCard from './InfoCard.jsx'


export default function Popup({Verdict = 'neutral'}) {
    const getColorClasses = () => {
        switch(Verdict.toLowerCase()) {
            case 'true':
                return { 
                    header: 'bg-green-500', 
                    statement: 'bg-green-900', 
                    hover: 'hover:text-green-300',
                    textColor: 'text-green-900',
                    icon: '/src/assets/Truth_Icon.png',
                    label: 'Likely True'
                };
            case 'fake':
                return { 
                    header: 'bg-red-500', 
                    statement: 'bg-red-900', 
                    hover: 'hover:text-red-300',
                    textColor: 'text-red-900',
                    icon: '/src/assets/Fake_Icon.png',
                    label: 'Likely Fake'
                };
            case 'neutral':
                return { 
                    header: 'bg-yellow-500', 
                    statement: 'bg-yellow-800', 
                    hover: 'hover:text-yellow-300',
                    textColor: 'text-yellow-700',
                    icon: '/src/assets/Needs_Context_Icon.png',
                    label: 'Needs Context'
                };
            default:
                return { 
                    header: 'bg-red-500', 
                    statement: 'bg-red-900', 
                    hover: 'hover:text-red-300',
                    textColor: 'text-red-900',
                    icon: '/src/assets/Fake_Icon.png',
                    label: 'Likely Fake'
                };
        }
    };

    const colors = getColorClasses();

    return (
        <div className="fixed top-0 right-0 h-screen w-1/4 max-w-md bg-white/70 text-gray-900 shadow-2xl z-50 flex flex-col rounded-l-md overflow-hidden">
        
        {/* Header */}
            <div className={`relative flex items-center justify-between px-3 py-2 ${colors.header} rounded-tl-md`}>
            <h2 className="text-lg font-bold text-white">TrueScope</h2>

                <button
                type="button"
                aria-label="Close panel"
                className={`absolute -right-2 top-1/2 -translate-y-1/2 text-white text-xl font-bold ${colors.hover} focus:outline-none transition p-2 rounded-md focus:ring-0`}
                style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', boxShadow: 'none' }}
                >
                ✕
                </button>
        </div>

        {/*Statement Area*/}
        <div className={`flex flex-col items-center justify-center p-1 space-y-0 w-full ${colors.statement}`}>
            <p className="text-sm font-semibold italic text-white/80">"P20 rice distributed nationwide next week."</p>
            <p className="text-xs font-semibold bold text-white/50">Statement</p>
        </div>

        {/*Verdict/Summary Area*/}
        <div className='flex border-b-2 border-black/20'>
            <div className='flex flex-col items-center justify-center p-1 w-1/3 border-r-2 border-black/20 space-y-0'>
            <img className='w-20 h-20 object-contain' src={colors.icon} />
            <p className={`m-0 text-sm -mt-1 font-bold italic ${colors.textColor}`}>{colors.label}</p>
            </div>
            <div className='p-2 space-y-1 w-2/3'>
            <p className='text-xs font-semibold text-black/70'>Truth Confidence Score<InfoCard title="Truth Confidence Score" definition="This score represents the confidence level in the truthfulness of the statement based on the analysis of supporting and refuting articles." />: <span className='font-bold text-xs'>49%</span></p>
            <p className='text-xs font-semibold text-black/70'>Bias Consistency Scoring<InfoCard title="Bias Consistency Scoring" definition="This score indicates how consistent the bias is across different sources supporting the statement." />:</p>
            <BiasBar type="consistency" value={20} />
            <p className='text-xs font-semibold text-black/70'>Bias Divergence<InfoCard title="Bias Divergence" definition="This score measures the extent of divergence in bias among different sources." />: <span className='font-bold text-xs'>15%</span></p>
            </div>
        </div>

        {/* Articles Area */}
        <div className='bg-black/30 '>
            <p className='px-2 py-1 font-bold text-[13px]'>Supporting Articles</p>
        </div>
        <div className="flex-1 min-h-0 p-0 overflow-hidden overflow-y-auto flex flex-col gap-0">
            {/* Article cards go here for loop...Need to add details from json*/}
            <ArticleCard oddEven={'even'} support={'neutral'} source={"Verafiles"} title={"Government Denies P20 rice"} Remarks={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} VerdictScore={48} ArticleLink={"#"} />
            <ArticleCard oddEven={'odd'} support={'refute'} source={"FactCheck"} title={"P20 rice distribution delayed"} Remarks={"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} VerdictScore={52} ArticleLink={"#"} />
            <ArticleCard oddEven={'even'} support={'support'} source={"NewsDaily"} title={"Rice distribution plans announced"} Remarks={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} VerdictScore={60} ArticleLink={"#"} />
            <ArticleCard oddEven={'odd'} support={'neutral'} source={"TruthWatch"} title={"P20 rice claim debunked"} Remarks={"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} VerdictScore={40} ArticleLink={"#"} />
            <ArticleCard oddEven={'even'} support={'support'} source={"ReliableNews"} title={"Government confirms rice distribution"} Remarks={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."} VerdictScore={55} ArticleLink={"#"} />
            <ArticleCard oddEven={'odd'} support={'refute'} source={"FactCheck"} title={"Rice distribution misinformation"} Remarks={"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} VerdictScore={45} ArticleLink={"#"} />
            <ArticleCard oddEven={'even'} support={'refute'} source={"FactCheck"} title={"Rice distribution misinformation"} Remarks={"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."} VerdictScore={45} ArticleLink={"#"} />
        </div>

        </div>

    )
}