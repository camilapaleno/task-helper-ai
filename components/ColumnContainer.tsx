import { ArrowsRightLeftIcon, Bars4Icon, EqualsIcon, PauseIcon, QueueListIcon, SwatchIcon, TrashIcon, ViewColumnsIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { DotSquareIcon, GrabIcon, GridIcon, PlusIcon } from "lucide-react";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;

    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
    tasks: Task[]; 
    
} 

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props;

    const [editMode, setEditMode] = useState(false);


    const tasksIds = useMemo (() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        transition, 
        isDragging,
         } 
        = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return <div ref={setNodeRef}
        
        style={style}
        className="flex flex-col h-[500px] w-[350px] min-w-[350px]
         rounded-lg filter bg-white/20
        blur-sm
        p-4"

        />
    }

  return (


        <div 
            ref={setNodeRef}
            style={style}
            className="flex flex-col h-[500px] w-[350px] min-w-[350px] 
            rounded-lg bg-white border border-white p-4 text-slate-500
        " >
            

            <div 
                {...attributes} 
                {...listeners}
                className="mb-1 border border-slate-300 bg-white rounded-lg 
                p-3 h-12 flex align-middle justify-between cursor-default">
                


                <div>
                    <Bars4Icon className="h-5 stroke-slate-500 hover:stroke-slate-700 cursor-grab pr-2" />
                    </div>

                    <div 
                        onClick={() => {
                        setEditMode(true)
                        }}
                        className="flex-grow cursor-text text-sm align-middle font-bold"
                        >
                        {!editMode && column.title}
                        {editMode && (
                            <input
                                className="text-blue-400 outline-none"
                                value={column.title}
                                onChange={e => updateColumn(column.id, e.target.value)}
                                autoFocus
                                onBlur={() => {
                                    setEditMode(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return;
                                    setEditMode(false);
                                }}
                            />

                        )}
                        
                    </div>

                    
                    <button onClick={() => {
                        deleteColumn(column.id);
                    }}> 
                        <TrashIcon className="h-5 stroke-slate-500 hover:stroke-red-500" />
                    </button>
                
            </div>
            <div className="flex flex-grow flex-col overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}>
                        
                    </TaskCard>
                ))}
                </SortableContext>
            </div>
            <button 
                className="flex gap-2 items-center text-sm text-slate-400 
                hover:text-slate-600 cursor-pointer
                border-t pt-4"
                onClick={() => {
                     createTask(column.id);
                }}
            >
                <PlusIcon className="h-5" />
                Add Task
            </button>
        </div>
  )
}

export default ColumnContainer
