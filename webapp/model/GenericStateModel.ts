/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Context from 'sap/ui/model/Context';
import JSONModel from 'sap/ui/model/json/JSONModel';

/**
 * @namespace @namespace tvc.ui5.configurator
 */
export default class GenericJSONModel<T> extends JSONModel {
    _testType: any;

    constructor(data: T) {
        super();
        this._setData(data);
    }

    public _setData(oData: T, bMerge?: boolean): void {
        this.setData(<any>oData, bMerge);

        this._checkUpdate();
        this._observeFunctions();
    }

    public getState(): T {
        return (this as any).oData as T;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getContext(key: string): Context {
        //@ts-ignore
        return JSONModel.prototype.getContext.apply(this, arguments);
    }

    private _observeFunctions() {
        //small trick: we are calling a check update after every single function (instead of after every single attribute change)
        //as we are 100% ensuring, that nobody is adjusting the values..
        const allData = (this as any).oData as T;
        let bHooked = false;

        Object.getOwnPropertyNames(Object.getPrototypeOf((this as any).oData)).forEach(sAttr => {
            const sVal = (<any>allData)[sAttr];
            if (typeof sVal === 'function') {
                const funcBefore: Function = sVal;
                const funcCheckUpdate = this._checkUpdate.bind(this);
                (<any>allData)[sAttr] = function (...args: any[]) {
                    let ret: any = null;
                    const bFirstCall = bHooked === false;
                    bHooked = true;

                    try {
                        ret = funcBefore.apply(this, args);
                    } finally {
                        bHooked = bFirstCall === true ? false : true;
                    }
                    if (bFirstCall === true) {
                        funcCheckUpdate();
                    }
                    return ret;
                };
            }
        });
    }

    public _checkUpdate() {
        (<any>this).checkUpdate(false, true);
    }
}
