"use client";

import { Column, Id } from '@/types';
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Task } from '@/types';
import TaskCard from './TaskCard';

function Board() {

    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((col) => col.id),
    [columns]);

    const [tasks, setTasks] = useState<Task[]>([]);
    
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    //drag starts after moving 3px so buttons are still clickable
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
    }))

    return (

    <div className="
    m-auto
    flex
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    ">
        <DndContext 
            sensors={sensors}
            onDragStart={onDragStart} 
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            >
            <div className='m-auto flex gap-4 pb-5'>
                <div className='flex gap-4'>
                    <SortableContext items={columnsId}>
                    {columns.map((col) => ( 
                        <ColumnContainer 
                            key={col.id}
                            column={col} 
                            deleteColumn={deleteColumn}
                            updateColumn={updateColumn}
                            createTask={createTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter((task) => task.columnId === col.id)}
                        />
                    ))}
                    </SortableContext>
                </div>

                <div
                className="flex flex-col h-[500px] w-[350px] min-w-[350px] 
                rounded-lg border border-white  shadow-md p-4 text-white
               "
                >
                    <div
                    className="mb-1 border border-white rounded-lg 
                    p-3 h-12 flex cursor-pointer
                    hover:bg-white/30"
                    >
                        <button 
                        onClick={() => {
                            createNewColumn();
                        }}
                        className="text-sm flex align-middle
                        ">
                            <PlusCircleIcon className="h-full pr-2"/> Add column
                        </button>  

                    </div>
                  
                </div>

            </div>
            
            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                            column={activeColumn}
                            deleteColumn={deleteColumn}
                            updateColumn={updateColumn}
                            createTask={createTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                        />
                    )}  
                    {activeTask && (
                        <TaskCard 
                        task={activeTask} 
                        deleteTask={deleteTask} 
                        updateTask={updateTask}
                        />
                     )}
                </DragOverlay>,
                document.body             
            )}

        </DndContext>
    </div>
    );

  function createTask(columnId: Id) {
    const newTask: Task = {
        id: generateId(),
        columnId,
        content: `Task ${tasks.length + 1}`,
    }

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
        if (task.id !== id) return task;
        return {...task, content};
    });
    setTasks(newTasks);
  } 
  
  function createNewColumn() {
    const columnToAdd: Column = {
        id: generateId(),
        title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function onDragStart(event: DragStartEvent) {
    if(event.active.data.current?.type === "Column") {
        setActiveColumn(event.active.data.current.column);
        return;
    }

    if(event.active.data.current?.type === "Task") {
        setActiveTask(event.active.data.current.task);
        return;
    }
  }

  //check where this should be
  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
        if (col.id !== id) return col;
        return {...col, title};
    });
    setColumns(newColumns);

  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const {active,over} = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
            (col) => col.id === activeColumnId
        );

        const overColumnIndex = columns.findIndex(
            (col) => col.id === overColumnId
        );

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const {active,over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    //dropping task over another task

    if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);

            const overIndex = tasks.findIndex((t) => t.id === overId);


            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            

            return arrayMove(tasks, activeIndex, overIndex);
        })
    }

    const isOverAColumn = over.data.current?.type === "Column";

    //dropping task over a column
    if (isActiveATask && isOverAColumn) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === 
            activeId);

            tasks[activeIndex].columnId = overId;

            return arrayMove(tasks, activeIndex, activeIndex);
        })
    }

  }
}

function generateId() {
    return Math.floor(Math.random() * 10001)
    
}

export default Board;
