import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Movement } from '../../types/movement';
import { MovementCard } from './MovementCard';

interface MovementKanbanProps {
  movements: Movement[];
  onViewDetails: (movement: Movement) => void;
  onGenerateInvoice: (movement: Movement) => void;
  onGenerateBankSlip: (movement: Movement) => void;
  onSendBillingMessage: (movement: Movement, method: 'email' | 'whatsapp') => void;
}

const columns = [
  { id: 'PENDENTE', title: 'Pendente' },
  { id: 'PROCESSANDO', title: 'Processando' },
  { id: 'CONCLUIDO', title: 'Concluído' },
  { id: 'CANCELADO', title: 'Cancelado' }
];

export function MovementKanban({
  movements,
  onViewDetails,
  onGenerateInvoice,
  onGenerateBankSlip,
  onSendBillingMessage
}: MovementKanbanProps) {
  const [items, setItems] = useState(movements);

  const getColumnMovements = (columnId: string) => {
    return items.filter(movement => movement.status === columnId);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movement = items.find(m => m.movement_id.toString() === draggableId);
    if (!movement) return;

    const newItems = items.map(item =>
      item.movement_id.toString() === draggableId
        ? { ...item, status: destination.droppableId }
        : item
    );

    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {column.title}
            </h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {getColumnMovements(column.id).map((movement, index) => (
                    <Draggable
                      key={movement.movement_id}
                      draggableId={movement.movement_id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <MovementCard
                            movement={movement}
                            onViewDetails={onViewDetails}
                            onGenerateInvoice={onGenerateInvoice}
                            onGenerateBankSlip={onGenerateBankSlip}
                            onSendBillingMessage={onSendBillingMessage}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}