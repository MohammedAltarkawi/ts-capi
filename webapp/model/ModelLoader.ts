/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import JSONModel from "sap/ui/model/json/JSONModel";
import { LINKS } from "./Enums";

export abstract class ModelLoader {
    static getYear(year: string): Promise<JSONModel> {
        return new Promise((resolve) => {
            let sVersion: string;

            switch (year) {
                case "2022":
                    sVersion = LINKS.V2022;
                    break;
                case "2023":
                    sVersion = LINKS.V2023;
                    break;
                
            }

            const oModel = new JSONModel(sVersion);

            // Attach event to know when data is loaded
            oModel.attachRequestCompleted(() => {
                
                resolve(oModel);
            });

           
        });
    }
}