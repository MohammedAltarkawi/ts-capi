import GenericJSONModel from "./GenericStateModel";


type YEAR = {
    year: string
}

type successor = {
    objectKey: string
    objectType: string
    tadirObjName: string
    tadirObject: string
}



export type API = {
    applicationComponent: string
    objectKey: string
    objectType: string
    softwareComponent: string
    state: string
    successorClassification: string;
    successors: successor[] ;
    tadirObjName: string
    tadirObject: string
}

class MainControllerStateDef {
    busy = false;
    APIs : API[] = [];
    versions: YEAR[] = [{
        year: "2022"
    },
    {
        year: "2023"
    }];

    /**
     * setAPI
API: API[] = []     */
    public setAPI(APIs: API[] = []) {
        this.APIs = APIs
        
    }







}

export type MainControllerStateRO = { +readonly [P in keyof MainControllerStateDef]: MainControllerStateDef[P] };
export const StateMainControllerModel = new GenericJSONModel<MainControllerStateRO>(new MainControllerStateDef());
export const MainStateController = StateMainControllerModel.getState();