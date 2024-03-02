import { Param, RepeatableParam } from '@data-story/core';
import React, { useState } from 'react';
import { Controller, ControllerRenderProps, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { StringableInput } from './StringableInput';
import { PortSelectionInput } from '../modals/nodeSettingsModal/tabs/Params/PortSelectionInput';
import { StringableWithConfig } from '../modals/nodeSettingsModal/tabs/Params';
import { ReactFlowNode } from '../../Node/ReactFlowNode';
import { DragIcon } from '../icons/dragIcon';
import { CloseIcon } from '../icons/closeIcon';
import { DndProvider, useDrop } from 'react-dnd';
import { Row } from '@tanstack/react-table';
import { HTML5Backend } from 'react-dnd-html5-backend';

function RepeatableDraggableRow(props: RepeatableInputProps & {
  rowIndex: number,
  row: any,
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
}) {
  const { form, param,  node, row, rowIndex, reorderRow } = props;
  const name = param.name;
  const [, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<unknown>) => reorderRow(draggedRow.index, rowIndex),
  });
  console.log(row, 'row');
  console.log(param.row, 'param.row');

  return <tr className="bg-white border-b dark:border-gray-700">
    <td
      ref={dropRef}
      className="border font-medium whitespace-nowrap bg-gray-50 align-top"
    >
      <button className="p-2">
        <DragIcon/>
      </button>
    </td>
    {
      row.map((column: Param, columnIndex: number) => (<td
        key={column.name}
        scope="row"
        className="border font-medium whitespace-nowrap bg-gray-50 align-top"
      >
        {column.type === 'StringableParam' && <StringableWithConfig
          form={form}
          param={column}
          {...column}
          name={`${name}.${columnIndex}.${column.name}`}
          node={node}
        />}
        {column.type === 'PortSelectionParam' && <PortSelectionInput
          form={form}
          param={column}
          {...column}
          name={`${name}.${columnIndex}.${column.name}`}
          node={node}
        />}
      </td>))
    }
    <td className="border font-medium whitespace-nowrap bg-gray-50 align-top">
      <button
        className="p-2"
        // onClick={handleDeleteRow}
      >
        <CloseIcon/>
      </button>
    </td>
  </tr>;
}

interface RepeatableInputProps {
  form: UseFormReturn<{
    [x: string]: any;
  }, any>;
  param: RepeatableParam<Param[]>;
  node: ReactFlowNode;

}

export function RepeatableInput1({
  form,
  param,
  node,
  field
}: RepeatableInputProps & {
  field:  ControllerRenderProps<any, 'params'>;
}) {
  const defaultRows = () => {
    return [param.row]
  }

  console.log(field, 'field');
  const [localRows, setLocalRows] = useState<any[]>(defaultRows());
  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    localRows.splice(
      targetRowIndex,
      0,
      localRows.splice(draggedRowIndex, 1)[0]
    );
    setLocalRows([...localRows]);

    // props.filed.onChange(JSON.stringify(localRows));
    console.log('localRows AFTER', localRows);
  };
  console.log('localRows', localRows);

  const addRow = () => {
    console.log('Adding row!')


    setLocalRows([
      ...(localRows),
      param.row
    ])
  }

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
          {localRows.map((row, i) => {
            return (<RepeatableDraggableRow key={i} reorderRow={reorderRow} row={row} rowIndex={i}  param={param} form={form} node={node} />
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

export const RepeatableInput = (props: RepeatableInputProps) => {
  console.log(props, 'props');
  return (
    <DndProvider backend={HTML5Backend}>
      <Controller
        render={({ field, fieldState, formState}) =>
          (<RepeatableInput1 field={field} {...props} />)}
        name={'params'}
        control={props.form.control} // todo: 这里随便写的
      />
    </DndProvider>
  )
}
