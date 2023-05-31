import {observable, action, makeObservable, computed, toJS} from 'mobx';
import {RootStore as RootStoreModel} from './rootStore';
import {NodeModel} from '@minoru/react-dnd-treeview';


export class FileStore {
    currentFile: NodeModel | null = null;
    files?: NodeModel[] | null = null;
    selectedNode?: NodeModel | null = null;
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
        console.log("this.files", toJS(this.files));
        if (this.files && this.files[index]) {
            this.files[index] = file;
            return toJS(this.files);
        }
        return null;
    }

    deleteFile = (index: number) => {
        console.log("this.files", toJS(this.files));
        if (this.files) this.files.splice(index, 1);
    }

    constructor(protected rootStore: RootStoreModel) {
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
