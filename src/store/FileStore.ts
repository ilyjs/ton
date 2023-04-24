import { observable, action, makeObservable, computed, toJS } from 'mobx';
import { RootStore as RootStoreModel } from './rootStore';
import { NodeModel } from '@minoru/react-dnd-treeview';

export interface IFileStore {
}

export class FileStore implements IFileStore {
  currentFile: NodeModel = null;
  files?: NodeModel[] = null;
  selectedNode?: NodeModel = null;
  lastId = 100;
  setFiles = (files: NodeModel[]) => this.files = files;
  setSelectedNode = (node: NodeModel) => this.selectedNode = node;
  setLastId = (lastId: number) => this.lastId = lastId;
  store: RootStoreModel;

  get selectFile() {
    if (!this.selectedNode) return toJS(this.currentFile);
    if (!this.selectedNode.droppable) {
      this.currentFile = this.selectedNode;
      return toJS(this.selectedNode);
    }
    return toJS(this.currentFile);
  }

  changeFileName = (file: any, index: number) => {
    console.log("this.files", toJS(this.files))
    this.files[index] = file;
    //this.files.
  }

  deleteFile = (index: number) => {
    console.log("this.files", toJS(this.files));
    this.files.splice(index, 1);
  }

  constructor(private rootStore: RootStoreModel) {
    this.store = rootStore;
    makeObservable(this, {
      files: observable,
      selectedNode: observable,
      lastId: observable,
      setSelectedNode: action,
      setFiles: action,
      setLastId: action,
      changeFileName: action,
      deleteFile: action,
      selectFile: computed

    });

  }


}
