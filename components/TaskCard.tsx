import { Id, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id : Id) => void;
    updateTask: (id : Id, content: string) => void;
} 

function TaskCard({ task, deleteTask, updateTask }: Props) {

    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging,
         } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (<div 
        ref={setNodeRef}
        style={style}
        className="
        bg-slate-800/10 filter
        blur-sm
        opacity-50 
        my-1
        p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl relative cursor-grab"
        />)
    }

    if (editMode) {
        return (
        <div 
        ref={setNodeRef}
        style={style}
        {...attributes} 
        {...listeners} 
        className="
        bg-blue-100/50 border border-blue-300
        my-1
        p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-lg relative cursor-grab 
        text-sm 
        "
        >
           <textarea 
                className="h-[90%] w-full resize-none border-none rounded bg-transparent text-blue-400 focus:outline-none "
                value={task.content}
                autoFocus
                placeholder="New Task"
                onBlur={toggleEditMode}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) toggleEditMode();
                }}
                onChange={(e) => updateTask(task.id, e.target.value)}
            >
           </textarea>
        </div>
        );
    }

  return (
    <div
        ref={setNodeRef}
        style={style}
        {...attributes} 
        {...listeners} 
        onClick={toggleEditMode}
        className="bg-white  border border-slate-200
        my-1
        p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-lg relative cursor-grab
        hover:border-blue-300"
        onMouseEnter={() => {
            setMouseIsOver(true);
        }}
        onMouseLeave={() => {
            setMouseIsOver(false);
        }}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap 
            cursor-text text-slate-500 text-sm task">
                {task.content}</p>
            {mouseIsOver && (
                <button onClick={() => deleteTask(task.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2">
                    <XIcon className="stroke-slate-500 hover:stroke-red-500 h-4" />
                </button>                
            )}

    </div>
  )
}

export default TaskCard;