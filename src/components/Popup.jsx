import { useState, useEffect } from 'react'
import BiasBar from './BiasBar.jsx'
import ArticleCard from './ArticleCard.jsx'
import InfoCard from './InfoCard.jsx'
import TruthIcon from '../assets/Truth_Icon.png'
import FakeIcon from '../assets/Fake_Icon.png'
import NeedsContextIcon from '../assets/Needs_Context_Icon.png'


export default function Popup({Verdict}) {
    const [selectedText, setSelectedText] = useState('');

    useEffect(() => {
        // Retrieve the selected text from Chrome storage
        chrome.storage.local.get(['selectedText'], (result) => {
            if (result.selectedText) {
                setSelectedText(result.selectedText);
                // Clear the storage after retrieving
                chrome.storage.local.remove('selectedText');
            }
        });
    }, []);

    const getColorClasses = () => {
        switch(Verdict.toLowerCase()) {
            case 'true':
                return { 
                    header: 'bg-green-500', 
                    statement: 'bg-green-900', 
                    hover: 'hover:text-green-300',
                    textColor: 'text-green-900',
                    icon: TruthIcon,
                    label: 'Likely True'
                };
            case 'fake':
                return { 
                    header: 'bg-red-500', 
                    statement: 'bg-red-900', 
                    hover: 'hover:text-red-300',
                    textColor: 'text-red-900',
                    icon: FakeIcon,
                    label: 'Likely Fake'
                };
            case 'neutral':
                return { 
                    header: 'bg-yellow-500', 
                    statement: 'bg-yellow-800', 
                    hover: 'hover:text-yellow-300',
                    textColor: 'text-yellow-700',
                    icon: NeedsContextIcon,
                    label: 'Needs Context'
                };
            default:
                return { 
                    header: 'bg-red-500', 
                    statement: 'bg-red-900', 
                    hover: 'hover:text-red-300',
                    textColor: 'text-red-900',
                    icon: FakeIcon,
                    label: 'Likely Fake'
                };
        }
    };

    const colors = getColorClasses();

    return (
        <div className="w-full h-screen bg-white/70 text-gray-900 flex flex-col overflow-hidden">
        
        {/*Statement Area*/}
        <div className={`flex flex-col items-center justify-center p-3 space-y-0 w-full ${colors.statement}`}>
            <p className="text-sm font-semibold italic text-white/80 wrap-break-words text-center w-full">"{selectedText || "P20 rice distributed nationwide next week."}"</p>
            <p className="text-xs font-semibold bold text-white/50">Statement</p>
        </div>

        {/*Verdict/Summary Area*/}
        <div className='flex border-b-2 border-black/20'>
            <div className='p-2 space-y-1 w-2/3'>
            <p className='text-xs font-semibold text-black/70'>Truth Confidence Score<InfoCard title="Truth Confidence Score" definition="This score represents the confidence level in the truthfulness of the statement based on the analysis of supporting and refuting articles." />: <span className='font-bold text-xs'>49%</span></p>
            <p className='text-xs font-semibold text-black/70'>Bias Consistency Scoring<InfoCard title="Bias Consistency Scoring" definition="This score indicates how consistent the bias is across different sources supporting the statement." />:</p>
            <BiasBar type="consistency" value={20} />
            <p className='text-xs font-semibold text-black/70'>Bias Divergence<InfoCard title="Bias Divergence" definition="This score measures the extent of divergence in bias among different sources." />: <span className='font-bold text-xs'>15%</span></p>
            </div>
            <div className='flex flex-col items-center justify-center p-1 w-1/3 border-l-2 border-black/20 space-y-0'>
            <img className='w-20 h-20 object-contain' src={colors.icon} />
            <p className={`m-0 text-sm -mt-1 font-bold italic ${colors.textColor}`}>{colors.label}</p>
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