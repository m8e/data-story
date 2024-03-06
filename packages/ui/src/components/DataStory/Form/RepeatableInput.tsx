import { Param } from '@data-story/core';
import React, { useCallback } from 'react';
import {
  useFieldArray,
  UseFormReturn,
} from 'react-hook-form';
import { PortSelectionInput } from '../modals/nodeSettingsModal/tabs/Params/PortSelectionInput';
import { StringableWithConfig } from '../modals/nodeSettingsModal/tabs/Params';
import { ReactFlowNode } from '../../Node/ReactFlowNode';
import { DragIcon } from '../icons/dragIcon';
import { CloseIcon } from '../icons/closeIcon';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { Row } from '@tanstack/react-table';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RepeatableProps } from '../types';

function RepeatableCell({
  paramColumn,
  form,
  name,
  rowIndex,
  node,
}: {
  paramColumn: Param,
  form: UseFormReturn<{[p: string]: any}, any>,
  name: any,
  columnIndex: number,
  rowIndex: number,
  node: ReactFlowNode,
}) {

  return <td
    scope="row"
    className="border font-medium whitespace-nowrap bg-gray-50 align-top"
  >
    {paramColumn.type === 'StringableParam' && <StringableWithConfig
      form={form}
      param={paramColumn}
      {...paramColumn}
      name={`params.${name}.${rowIndex}.${paramColumn.name}`}
      node={node}
    />}
    {paramColumn.type === 'PortSelectionParam' && <PortSelectionInput
      form={form}
      param={paramColumn}
      {...paramColumn}
      name={`params.${name}.${rowIndex}.${paramColumn.name}`}
      node={node}
    />}
  </td>;
}

function RepeatableDraggableRow(props: RepeatableProps & {
  rowIndex: number,
  row: any,
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
  deleteRow: (index: number) => void
}) {
  const { form, param,  node, row, rowIndex, reorderRow, deleteRow } = props;
  const name = param.name;
  const paramRow = param.row;

  const [, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<unknown>) => reorderRow(draggedRow.index, rowIndex),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ index: rowIndex, ...row}),
    type: 'row',
  });

  function handleDeleteRow() {
    deleteRow(rowIndex);
  }

  return <tr
    ref={previewRef}
    style={{ opacity: isDragging ? 0.5 : 1 }}
    className="bg-white border-b dark:border-gray-700">
    <td
      ref={dropRef}
      className="border font-medium whitespace-nowrap bg-gray-50 align-top"
    >
      <button className="p-2" ref={dragRef}>
        <DragIcon/>
      </button>
    </td>
    {
      param.row.map((column: Param, columnIndex: number) => (
        <RepeatableCell
          key={`${paramRow[columnIndex].name}-${columnIndex}`}
          paramColumn={column} form={form}
          name={name} rowIndex={rowIndex}
          columnIndex={columnIndex} node={node}
        />
      ))
    }
    <td className="border font-medium whitespace-nowrap bg-gray-50 align-top">
      <button
        className="p-2"
        onClick={handleDeleteRow}
      >
        <CloseIcon/>
      </button>
    </td>
  </tr>;
}



const defaultRowData = (row: Param[]) => {
  const id = Math.random().toString(36).substring(7);
  const data = Object.fromEntries( row.map((column: Param) => {
    return [column.name, column.value]
  }));
  return {
    id,
    ...data
  }
}

export function RepeatableComponent({
  form,
  param,
  node,
}: RepeatableProps) {
  const { fields, append, remove, swap} = useFieldArray({
    control: form.control,
    name: `params.${param.name}`,
  });

  const addRow = useCallback(() => {
    append(defaultRowData(param.row));
  }, [append, param.row]);

  return (
    <div className="flex flex-col text-xs w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 text-gray-400">
          <tr>
            <th className='px-6 py-3 border'/>
            {param.row.map((column: any) => {
              return <th
                key={column.name}
                scope="col"
                className="px-6 py-3 border"
              >{column.label}</th>
            })}
            <th className='px-6 py-3 border'/>
          </tr>
        </thead>
        <tbody>
          {fields.map((row, i) => {
            return (
              <RepeatableDraggableRow
                key={`${i}-${row.id}`}
                reorderRow={swap}
                deleteRow={remove}
                row={row} rowIndex={i}
                param={param} form={form}
                node={node}
              />
            )
          })}
        </tbody>
      </table>

      <div className="flex bg-gray-50 w-full">
        <button
          className="border w-full p-2 text-xs uppercase border-rounded text-gray-400"
          onClick={addRow}>Add row</button>
      </div>
    </div>
  );
}

export const RepeatableInput = (props: RepeatableProps) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <RepeatableComponent {...props} />
    </DndProvider>
  )
}
