import { ControlButton } from 'reactflow';
import React from 'react';
import { SaveIcon, useDataStoryControls, OpenIcon } from '@data-story/ui';
import { Diagram } from '@data-story/core';
import IpcRendererEvent = Electron.IpcRendererEvent;

export interface LocalDiagram {
  type: 'load' | 'save';
  version: string;
  name: string;
  diagram: Diagram;
}

const getCoreVersion = () => {
  const { version } = require('@data-story/core/package.json');
  return version;
}
const saveDiagram = (key: string, diagram: Diagram) => {

  const diagramJSON = JSON.stringify({
    type: 'save',
    version: getCoreVersion(),
    name: key,
    diagram
  } as LocalDiagram);

  window.electron.send('save-json', diagramJSON);

};

export const loadDiagram = (key: string): LocalDiagram => {
  const initDiagram: LocalDiagram = {
    type: 'load',
    version: getCoreVersion(),
    name: key,
    diagram: null
  }

  window.electron.send('open-file-dialog', key);
  window.electron.receive('selected-file', (event: IpcRendererEvent, data: any) => {
    console.log('selected-file', data);
  });
  if (typeof window === 'undefined' || !localStorage?.getItem(key)) {
    return initDiagram;
  }

  const json = localStorage?.getItem(key);
  const { name, diagram } = JSON.parse(json);

  initDiagram.diagram = new Diagram(diagram.nodes, diagram.links);
  initDiagram.name = name;

  return initDiagram;
}

export const LocalStorageKey = 'data-story-diagram';

export const SaveComponent = () => {
  const { getDiagram } = useDataStoryControls()

  return (
    <>
      <ControlButton
        title="Save"
        aria-label="Save"
        onClick={() => {
          const diagram = getDiagram();
          saveDiagram(LocalStorageKey, diagram);
        }}>
        <SaveIcon/>
      </ControlButton>
      <ControlButton
        title="Open"
        aria-label="Open"
        onClick={() => {
          loadDiagram(LocalStorageKey)
        }}>
        <OpenIcon />
      </ControlButton>
    </>
  );
}
