interface JQuery {
    panelslider(options: PanelSlider): void;
}

interface JQueryStatic {
    panelslider: {
        close(): any;
    };
}

type PanelSlider = {
    side: "right";
    clickClose: boolean;
    duration: number;
};

