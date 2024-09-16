
import BaseController from "./BaseController";

import Fragment from "sap/ui/core/Fragment";

import ResponsivePopover from "sap/m/ResponsivePopover";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import JSONModel from "sap/ui/model/json/JSONModel";
import Table from "sap/ui/table/Table";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import SearchField from "sap/m/SearchField";

import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import { API, MainStateController, StateMainControllerModel } from "../model/MainControllerState";
import { ModelLoader } from "../model/ModelLoader";

import Select from "sap/m/Select";

/**
 * @namespace com.altarkawi.capi.controller
 */
export default class Main extends BaseController {
	private _oState = MainStateController;
	private _pValueHelpDialog: ResponsivePopover;
	private _oTable: Table;
	private _oYearSelectFeild: Select
	
	public onInit(): void {
		this.setModel(StateMainControllerModel, "mainView");
		this._oTable = this.getView().byId("table");
		
		
		
		ModelLoader.getYear('2022').then((oModel) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const data = oModel.getData().objectReleaseInfo as API[]; 
			this._oState.setAPI(data)
        })
        .catch((error) => {
            console.error("Failed to load model:", error);
        });
		
		

		
	}

	
	public async handleDetailsPress(oEvent: Event) {
		const oButton = oEvent.getSource() as Button;
		const oAPI = oButton.getBindingContext("mainView").getObject() as API;
		const oTmpModel = new JSONModel({ successors: oAPI.successors })
	
		if (!this._pValueHelpDialog) {
            this._pValueHelpDialog = (await Fragment.load({
                id: 'SelectBusinessPartner',
                name: 'com.altarkawi.capi.view.Popover',
                controller: this
            })) as ResponsivePopover;
        }
		this._pValueHelpDialog.setModel(oTmpModel, "dialogView");

		this.getView().addDependent(this._pValueHelpDialog);
		this._pValueHelpDialog.openBy(oButton);
	}


	public formatAvailableToObjectState(bAvailable: string) {
		let sState: string;
		switch (bAvailable) {
			case "released":
sState = 'Success'
				break;
			case "notToBeReleased":
sState = "Error"
				break;
			case "notToBeReleasedStable":
sState = "Warning"
				break;
			case "deprecated":
sState = "Error"
				break;

		}


		return sState
	}


	
	public onChangeVersion(oEvent: Event) {
		const oSelectFeild = oEvent.getSource() as Select;
		const sKey = oSelectFeild.getSelectedKey();

		ModelLoader.getYear(sKey).then((oModel) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const data = oModel.getData().objectReleaseInfo as API[]; 
			this._oState.setAPI(data)
        })
        .catch((error) => {
            console.error("Failed to load model:", error);
        });

	}
	public onSearch(oEvent: Event) {
		const oSearchField = oEvent.getSource() as SearchField;
		const sValue = oSearchField.getValue();
		const aFilters : Filter[] = [];
		const aTmpFilters = [new Filter("tadirObject", FilterOperator.Contains, sValue), new Filter("tadirObjName", FilterOperator.Contains, sValue)]
		const oFilter = new Filter({
			filters: aTmpFilters,
			and: false
		})
	
		aFilters.push(oFilter)
		const oTblBinding = this._oTable.getBinding() as ODataListBinding;
		oTblBinding.filter(aFilters);
	}

}


