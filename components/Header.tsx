import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { ArrowTrendingUpIcon, BoltIcon, ClipboardDocumentCheckIcon, MagnifyingGlassCircleIcon, RectangleGroupIcon, RectangleStackIcon, SparklesIcon } from "@heroicons/react/24/outline"

function Header() {
  return (
    <header>
        <div className="flex flex-col md:flex-row align-middle items-center p-5 bg-white/20 ">
            <div
                className="
                absolute
                top-0
                left-0
                w-full
                h-96
                bg-gradient-to-br from-pink-400 to-blue-600
                rounded-md
                filter
                blur-3xl
                opacity-50
                -z-50
                "
            />
            
            <h1 className="text-3xl font-bold pb-5 md:pb-0 text-slate-700 flex align-middle">
                <ArrowTrendingUpIcon className="h-9 pr-2" />
                task helper AI</h1>

            <div className="flex justify-end flex-1">

                <div className="flex w-full max-w-sm items-center space-x-2 border border-white rounded-lg">
                <MagnifyingGlassIcon className="h-6 w-6 ml-3 stroke-none fill-white" />
                    <Input className="bg-transparent focus-visible:ring-transparent focus-visible:ring-offset-0 border-none
                    text-slate-500" 
                    type="text" placeholder="Search..." />
                </div>
            </div>
        </div>
        <div className="flex items-center justify-center px-5 py-5 ">
            <p className="flex items-center italic p-5 bg-white w-fit rounded-xl shadow-xl text-sm font-light text-blue-600">
                <SparklesIcon className="h-5 pr-1 animate-pulse"/> GPT is summarizing your tasks for the day...</p>
        </div>
    </header>
  )
}

export default Header
