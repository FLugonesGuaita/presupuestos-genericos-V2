import React from "react";
import ReactDOM from "react-dom/client";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// Configuración del Worker para PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs";

const h = React.createElement;

// Definición manual de constantes para evitar errores de importación en CDNs
const LineCapStyle = {
    Butt: 'Butt',
    Round: 'Round',
    Projecting: 'Projecting',
};

const LineJoinStyle = {
    Miter: 'Miter',
    Round: 'Round',
    Bevel: 'Bevel',
};

// Colores predefinidos comunes para bolígrafos
const PEN_COLORS = [
    '#000000', // Negro
    '#003366', // Azul Oscuro (Tinta)
    '#cc0000', // Rojo
    '#006600', // Verde
    '#ffffff'  // Blanco (Corrector)
];

// Generador de UUID compatible con contextos no seguros (http)
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const GOOGLE_FONTS = {
    'Caveat': 'https://fonts.gstatic.com/s/caveat/v17/WnznHAc5bAfYB2Q7aAnM.ttf',
    'Dancing Script': 'https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Rep8hA.ttf'
};

const FONT_FAMILIES = [
    { name: 'Helvetica', type: 'standard' },
    { name: 'Times-Roman', label: 'Times New Roman', type: 'standard' },
    { name: 'Caveat', type: 'google' },
    { name: 'Dancing Script', type: 'google' },
];

const DEFAULT_TEXT_ELEMENT = {
    type: 'text',
    text: 'Texto de ejemplo',
    x: 50,
    y: 50,
    width: 200,
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'normal',
    textAlign: 'left',
    lineHeight: 1.2,
    color: '#000000',
};

// --- ICONOS ---
const Icon = ({ path, className = "w-5 h-5" }) => h('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className }, h('path', { fillRule: "evenodd", d: path, clipRule: "evenodd" }));
const UploadIcon = ({ className }) => h(Icon, { path: "M9.47 1.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L10 3.06 6.28 6.78a.75.75 0 0 1-1.06-1.06l4.25-4.25ZM3.25 9.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 1 1.5 0v3.75a2.25 2.25 0 0 1-2.25 2.25H4.75A2.25 2.25 0 0 1 2.5 14.25V10.5a.75.75 0 0 1 .75-.75Z", className });
const PlusIcon = ({ className }) => h(Icon, { path: "M10 3a.75.75 0 0 1 .75.75v6.5h6.5a.75.75 0 0 1 0 1.5h-6.5v6.5a.75.75 0 0 1-1.5 0v-6.5H2.25a.75.75 0 0 1 0-1.5h6.5V3.75A.75.75 0 0 1 10 3Z", className });
const TrashIcon = ({ className }) => h(Icon, { path: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.53 6.53a.75.75 0 0 1 1.06-1.06L10 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L11.06 10l2.47 2.47a.75.75 0 1 1-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L8.94 10 6.53 7.53Z", className });
const MinusIcon = () => h(Icon, { path: "M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Z" });
const FitScreenIcon = () => h(Icon, { path: "M3 8.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H4.5v2.25a.75.75 0 0 1-1.5 0V8.25ZM15.5 6h2.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V8.25h-2.25a.75.75 0 0 1 0-1.5ZM8.25 3a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5H9v2.25a.75.75 0 0 1-1.5 0V7.5H5.25a.75.75 0 0 1 0-1.5H7.5V3.75A.75.75 0 0 1 8.25 3ZM11.75 16a.75.75 0 0 1-.75-.75v-2.25h-2.25a.75.75 0 0 1 0-1.5H11v-2.25a.75.75 0 0 1 1.5 0V11.5h2.25a.75.75 0 0 1 0 1.5H12.5v2.25a.75.75 0 0 1-.75.75Z", clipRule: "evenodd" });
const BrushIcon = ({ className }) => h(Icon, { path: "M15.207 3.793a1 1 0 0 1 0 1.414L8.5 12h-3a1 1 0 0 1-1-1v-3l6.793-6.793a1 1 0 0 1 1.414 0ZM11.5 15a2.5 2.5 0 0 0-2.5 2.5h5A2.5 2.5 0 0 0 11.5 15Z", className });
const UndoIcon = ({ className }) => h(Icon, { path: "M7.65 4.86a.75.75 0 0 1 1.2.7l-.42 2.68 2.68.42a.75.75 0 1 1-.23 1.48l-3.5-.55a.75.75 0 0 1-.61-.61l.55-3.5a.75.75 0 0 1 .33-.62Zm2.59 1.45a6 6 0 1 1-5.18 5.4.75.75 0 0 1 1.5-.15 4.5 4.5 0 1 0 4.29-4.9l.4-.04Z", className });
const RedoIcon = ({ className }) => h(Icon, { path: "M12.35 4.86a.75.75 0 0 0-1.2.7l.42 2.68-2.68.42a.75.75 0 1 0 .23 1.48l3.5-.55a.75.75 0 0 0 .61-.61l-.55-3.5a.75.75 0 0 0-.33-.62Zm-2.59 1.45a6 6 0 1 0 5.18 5.4.75.75 0 0 0-1.5-.15 4.5 4.5 0 1 1-4.29-4.9l-.4-.04Z", className });
const CopyIcon = ({ className }) => h(Icon, { path: "M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12a1.5 1.5 0 0 1 .439 1.061V16.5a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 5.5 16.5v-13H7v1.5a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-2H12a.5.5 0 0 0-.5.5v2.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1.5Z", className });
const DiskIcon = ({ className }) => h(Icon, { path: "M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13ZM13.25 9a.75.75 0 0 0-.75.75v.5h-5v-.5a.75.75 0 0 0-1.5 0v.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75Z", className });
const StarIcon = ({ className }) => h(Icon, { path: "M10 1l2.928 6.255 6.772.955-5 4.975 1.18 6.815L10 16.75l-6.08 3.25 1.18-6.815-5-4.975 6.772-.955L10 1z", className });
const FolderOpenIcon = ({ className }) => h(Icon, { path: "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z", className });
const ImageIcon = ({ className }) => h(Icon, { path: "M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z", className });
const DocIcon = ({ className }) => h(Icon, { path: "M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Zm13.25 9a.75.75 0 0 0-.75.75v.5h-5v-.5a.75.75 0 0 0-1.5 0v.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75Z", className });
const CheckIcon = ({ className }) => h(Icon, { path: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", className });
const DownloadIcon = ({ className }) => h(Icon, { path: "M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75zM2.25 13.5a.75.75 0 000 1.5h15.5a.75.75 0 000-1.5H2.25z", className });
const UploadFileIcon = ({ className }) => h(Icon, { path: "M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 101.09 1.03l2.955-3.129v8.614zM2.25 13.5a.75.75 0 000 1.5h15.5a.75.75 0 000-1.5H2.25z", className });

const InputGroup = ({ label, children }) => h('div', { className: 'flex flex-col gap-1.5' }, h('label', { className: 'text-[10px] uppercase tracking-wider font-bold text-slate-500' }, label), children);
const NumberInput = ({ value, onChange }) => h('input', { type: 'number', className: 'w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none', value, onChange });

const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    return h('div', { className: 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300' },
        h('div', { className: `flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-800 border-slate-700 text-white'}` },
            type === 'success' && h(CheckIcon, { className: "w-5 h-5 text-emerald-400" }),
            h('span', { className: "text-sm font-medium" }, message)
        )
    );
};

const ControlPanel = ({ 
    pdfDoc, 
    pdfFile, 
    numPages, 
    currentPage, 
    setCurrentPage, 
    generatePdf, 
    fileInputRef, 
    handleFileChange,
    selectedElementId,
    formState,
    updateSelectedElement,
    addElement,
    duplicateElement,
    toggleDrawingMode,
    isDrawingMode,
    brushSize,
    setBrushSize,
    elements,
    deleteElement,
    setSelectedElementId,
    undo,
    redo,
    canUndo,
    canRedo,
    savedSignatures,
    saveSignature,
    loadSignature,
    deleteSignature,
    savedTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    exportTemplate,
    handleImportTemplate,
    templateInputRef,
    handleImageUpload,
    imageInputRef
}) => {
    const isDraw = formState.type === 'draw';
    const isImage = formState.type === 'image';
    const [tab, setTab] = React.useState('tools'); 

    return h('div', { className: 'flex flex-col h-full bg-white p-5 border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto z-10' },
        h('div', { className: 'space-y-6 flex-grow' },
            h('div', { className: 'flex justify-between items-center' },
                h('div', {},
                    h('h2', { className: 'text-lg font-bold text-slate-900 tracking-tight' }, 'Panel de Control'),
                    h('p', { className: 'text-[10px] text-slate-400 font-semibold tracking-wider uppercase' }, 'HERRAMIENTAS DE EDICIÓN')
                ),
                h('div', { className: 'flex bg-slate-100 rounded-lg p-1 gap-0.5' },
                    h('button', { 
                        className: 'p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none text-slate-600 transition-all',
                        onClick: undo,
                        disabled: !canUndo,
                        title: 'Deshacer (Ctrl+Z)'
                    }, h(UndoIcon, { className: 'w-4 h-4' })),
                    h('button', { 
                        className: 'p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none text-slate-600 transition-all',
                        onClick: redo,
                        disabled: !canRedo,
                        title: 'Rehacer (Ctrl+Y)'
                    }, h(RedoIcon, { className: 'w-4 h-4' }))
                )
            ),
            
            !pdfDoc && h('div', { className: 'flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors group' },
                h('div', { className: 'w-14 h-14 bg-white shadow-sm border border-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300' },
                     h(UploadIcon, { className: 'w-7 h-7' })
                ),
                h('p', { className: 'font-bold text-slate-800 text-base' }, 'Sube tu documento'),
                h('p', { className: 'text-xs text-slate-500 mb-6 mt-1' }, 'Admite archivos PDF hasta 10MB'),
                 h('button', {
                    className: 'w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2',
                    onClick: () => fileInputRef.current?.click()
                }, 'Seleccionar PDF Local'),
                h('input', { ref: fileInputRef, type: 'file', accept: '.pdf', className: 'hidden', onChange: handleFileChange })
            ),

            pdfDoc && h(React.Fragment, null, 
                h('div', { className: 'p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3' },
                    h('div', { className: "w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600"}, 
                        h(DocIcon, { className: "w-5 h-5" })
                    ),
                    h('div', { className: "overflow-hidden" },
                        h('p', { className: "truncate font-semibold text-sm text-indigo-900" }, pdfFile?.name),
                        h('p', { className: "text-[10px] uppercase font-bold text-indigo-400" }, `${numPages} PÁGINAS • LISTO`)
                    )
                ),
                
                // Tabs
                h('div', { className: 'flex p-1 bg-slate-100 rounded-lg' },
                    h('button', {
                        className: `flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${tab === 'tools' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`,
                        onClick: () => setTab('tools')
                    }, 'Diseño'),
                    h('button', {
                        className: `flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all ${tab === 'saved' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`,
                        onClick: () => setTab('saved')
                    }, 'Biblioteca')
                ),
                
                h('div', { className: 'space-y-4' },
                    
                    // --- TAB: TOOLS ---
                    tab === 'tools' && h(React.Fragment, null,
                        // Toolbar
                        h('div', { className: 'flex flex-col gap-3 pb-5 border-b border-slate-100' },
                            h('div', { className: 'grid grid-cols-2 gap-2.5' },
                                h('button', { 
                                    className: `w-full font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm border ${!isDrawingMode ? 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm ring-1 ring-indigo-500/10' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`, 
                                    onClick: () => { 
                                        if(isDrawingMode) toggleDrawingMode(); 
                                        addElement(DEFAULT_TEXT_ELEMENT); 
                                    } 
                                }, h(PlusIcon, { className: "w-4 h-4" }), 'Texto'),
                                
                                h('button', { 
                                    className: `w-full font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm border bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm`, 
                                    onClick: () => imageInputRef.current?.click()
                                }, h(ImageIcon, { className: "w-4 h-4" }), 'Imagen'),
                                h('input', { ref: imageInputRef, type: 'file', accept: 'image/*', className: 'hidden', onChange: handleImageUpload }),

                                h('button', { 
                                    className: `col-span-2 w-full font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm border ${isDrawingMode ? 'bg-slate-800 text-white border-slate-800 shadow-inner' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`, 
                                    onClick: toggleDrawingMode 
                                }, h(BrushIcon, { className: "w-4 h-4" }), isDrawingMode ? 'Modo Dibujo Activo' : 'Dibujar / Firmar')
                            ),
                            
                            // Brush Settings
                            isDrawingMode && h('div', { className: 'bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200' },
                                h('label', { className: 'text-[10px] font-bold text-slate-400 uppercase flex justify-between tracking-wide' }, 
                                    'Grosor del Trazo', 
                                    h('span', { className: "text-slate-900" }, `${brushSize}px`)
                                ),
                                h('input', { 
                                    type: 'range', 
                                    min: '1', 
                                    max: '20', 
                                    value: brushSize, 
                                    onChange: (e) => setBrushSize(parseInt(e.target.value)),
                                    className: 'w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800'
                                }),
                                h('p', { className: 'text-xs text-slate-500 leading-relaxed' }, 'Usa el cursor para dibujar firmas o tachar contenido existente.')
                            )
                        ),

                        // Element Properties
                        selectedElementId && !isDrawingMode && h('div', { className: 'space-y-4 animate-in fade-in duration-200' },
                            h('div', { className: 'flex justify-between items-center pb-2 border-b border-slate-100'},
                                h('h3', { className: 'font-bold text-xs text-slate-900 uppercase tracking-wider' }, 
                                    isDraw ? 'AJUSTES DE TRAZO' : (isImage ? 'AJUSTES DE IMAGEN' : 'AJUSTES DE TEXTO')
                                ),
                                h('div', { className: 'flex gap-1' },
                                    !isDraw && !isImage && h('button', {
                                        onClick: duplicateElement,
                                        className: 'p-1.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors',
                                        title: 'Duplicar (Ctrl+D)'
                                    }, h(CopyIcon, { className: "w-4 h-4"})),
                                    !isDraw && !isImage && h('button', {
                                        onClick: () => {
                                            saveSignature();
                                            setTab('saved');
                                        },
                                        className: 'p-1.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors',
                                        title: 'Guardar en Biblioteca'
                                    }, h(DiskIcon, { className: "w-4 h-4"}))
                                )
                            ),
                            
                            !isDraw && !isImage && h(InputGroup, { label: 'Contenido' }, h('textarea', {
                                className: 'w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none',
                                rows: 3,
                                value: formState.text || '',
                                onChange: e => updateSelectedElement({ text: e.target.value })
                            })),

                            !isDraw && h('div', { className: 'grid grid-cols-2 gap-3' },
                                h(InputGroup, { label: 'Posición X' }, h(NumberInput, { value: Math.round(formState.x), onChange: e => updateSelectedElement({ x: parseInt(e.target.value, 10) }) })),
                                h(InputGroup, { label: 'Posición Y' }, h(NumberInput, { value: Math.round(formState.y), onChange: e => updateSelectedElement({ y: parseInt(e.target.value, 10) }) }))
                            ),

                            !isDraw && h('div', { className: 'grid grid-cols-2 gap-3' },
                                h(InputGroup, { label: 'Ancho' }, h(NumberInput, { value: Math.round(formState.width), onChange: e => {
                                    const val = parseInt(e.target.value, 10);
                                    if(isImage) {
                                        updateSelectedElement({ width: val, height: val / formState.aspectRatio });
                                    } else {
                                        updateSelectedElement({ width: val });
                                    }
                                }})),
                                !isImage && h(InputGroup, { label: 'Tamaño (px)' }, h(NumberInput, { value: formState.fontSize, onChange: e => updateSelectedElement({ fontSize: parseInt(e.target.value, 10) }) })),
                                isImage && h(InputGroup, { label: 'Alto' }, h(NumberInput, { value: Math.round(formState.height || 0), onChange: () => {} })) 
                            ),

                            isImage && h(InputGroup, { label: 'Opacidad' }, 
                                h('div', { className: 'flex items-center gap-3 pt-2' },
                                    h('input', { 
                                        type: 'range', min: '0.1', max: '1', step: '0.1', 
                                        value: formState.opacity || 1, 
                                        onChange: e => updateSelectedElement({ opacity: parseFloat(e.target.value) }),
                                        className: 'w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600'
                                    }),
                                    h('span', { className: 'text-xs font-mono text-slate-600 w-8 text-right' }, `${Math.round((formState.opacity || 1) * 100)}%`)
                                )
                            ),

                            !isDraw && !isImage && h(React.Fragment, null,
                                h(InputGroup, { label: 'Tipografía' },
                                    h('select', { 
                                        className: 'w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none',
                                        value: formState.fontFamily,
                                        onChange: e => updateSelectedElement({ fontFamily: e.target.value }) 
                                    }, ...FONT_FAMILIES.map(font => h('option', { value: font.name }, font.label || font.name)))
                                ),
                                h('div', { className: 'grid grid-cols-2 gap-3' },
                                    h(InputGroup, { label: 'Peso' }, h('select', { className: 'w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none', value: formState.fontWeight, onChange: e => updateSelectedElement({ fontWeight: e.target.value }) }, h('option', { value: 'normal' }, 'Normal'), h('option', { value: 'bold' }, 'Negrita'))),
                                    h(InputGroup, { label: 'Alineación' }, h('select', { className: 'w-full p-2 border border-slate-200 rounded-md bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none', value: formState.textAlign, onChange: e => updateSelectedElement({ textAlign: e.target.value }) }, h('option', { value: 'left' }, 'Izquierda'), h('option', { value: 'center' }, 'Centro'), h('option', { value: 'right' }, 'Derecha')))
                                ),
                                h('div', { className: 'space-y-2 pt-1' },
                                        h('label', { className: 'text-[10px] uppercase tracking-wider font-bold text-slate-500' }, 'Color de Tinta'),
                                        h('div', { className: 'flex gap-2 mb-2' },
                                            PEN_COLORS.map(c => h('button', {
                                                key: c,
                                                onClick: () => updateSelectedElement({ color: c }),
                                                className: `w-7 h-7 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 ${formState.color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`,
                                                style: { backgroundColor: c }
                                            }))
                                        ),
                                        h('div', { className: 'grid grid-cols-2 gap-3 items-center' },
                                            h(InputGroup, { label: 'Espaciado' }, h(NumberInput, { value: formState.lineHeight, onChange: e => updateSelectedElement({ lineHeight: parseFloat(e.target.value) }) })),
                                            h(InputGroup, { label: 'Hex' }, h('input', { type: 'color', className: 'w-full h-9 p-0.5 border border-slate-200 rounded-md cursor-pointer', value: formState.color, onChange: e => updateSelectedElement({ color: e.target.value }) }))
                                        )
                                )
                            ),
                            
                            h('button', { 
                                 className: 'w-full bg-white text-red-600 border border-red-200 font-medium py-2 px-4 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center gap-2 text-sm mt-6', 
                                 onClick: () => deleteElement(selectedElementId)
                             }, h(TrashIcon, { className: "w-4 h-4" }), 'Eliminar Elemento')
                        ),
                        
                        // Layer List
                        elements.filter(el => el.page === currentPage).length > 0 && h('div', { className: 'border-t border-slate-100 pt-5 mt-4' },
                            h('h3', { className: 'font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-3' }, `CAPAS (PÁG. ${currentPage})`),
                            h('ul', { className: 'space-y-1.5 max-h-48 overflow-y-auto pr-1' }, 
                                ...elements.filter(el => el.page === currentPage).map(el => 
                                    h('li', { 
                                        key: el.id, 
                                        className: `flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer border ${selectedElementId === el.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`,
                                        onClick: () => {
                                            if (isDrawingMode) toggleDrawingMode();
                                            setSelectedElementId(el.id);
                                        }
                                    },
                                        h('div', { className: 'flex items-center gap-3 overflow-hidden' },
                                            el.type === 'draw' ? h(BrushIcon, { className: "w-4 h-4 text-slate-400" }) : (
                                                el.type === 'image' ? h(ImageIcon, { className: "w-4 h-4 text-emerald-500" }) : h('span', { className: 'flex-shrink-0 w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-500 text-[10px] font-bold rounded' }, 'T')
                                            ),
                                            h('span', { className: 'truncate text-sm text-slate-700 font-medium' }, 
                                                el.type === 'draw' ? 'Trazo Manual' : (el.type === 'image' ? 'Imagen' : (el.text || '').split('\\n')[0])
                                            )
                                        ),
                                        h('button', { onClick: (e) => { e.stopPropagation(); deleteElement(el.id); }, className: 'text-slate-300 hover:text-red-500 transition-colors' }, h(TrashIcon, { className: 'w-4 h-4' }))
                                    )
                                )
                            )
                        )
                    ),
                    
                    // --- TAB: SAVED ITEMS ---
                    tab === 'saved' && h(React.Fragment, null,
                        
                        // Saved Signatures Section
                        h('div', { className: 'space-y-3 pb-6 border-b border-slate-100' },
                            h('div', { className: 'flex items-center gap-2 mb-2' },
                                h('div', { className: "p-1.5 bg-amber-100 rounded-md" }, h(StarIcon, { className: "text-amber-600 w-4 h-4" })),
                                h('h3', { className: 'font-bold text-slate-700 text-sm' }, 'Elementos Guardados')
                            ),
                            savedSignatures.length === 0 
                                ? h('div', { className: "p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center" }, 
                                    h('p', { className: 'text-xs text-slate-400' }, 'No tienes firmas guardadas.'),
                                    h('p', { className: 'text-[10px] text-slate-300 mt-1' }, 'Selecciona un texto y pulsa el icono de guardar.')
                                  )
                                : h('div', { className: 'space-y-2 max-h-48 overflow-y-auto pr-1' },
                                    savedSignatures.map((sig, idx) => 
                                        h('div', { key: idx, className: 'flex items-center gap-2 group' },
                                            h('button', {
                                                onClick: () => loadSignature(sig),
                                                className: 'flex-grow text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm text-sm truncate font-medium text-slate-600 bg-white transition-all'
                                            }, sig.text.substring(0, 30) + (sig.text.length > 30 ? '...' : '')),
                                            h('button', {
                                                onClick: () => deleteSignature(idx),
                                                className: 'text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors'
                                            }, h(TrashIcon, { className: "w-4 h-4" }))
                                        )
                                    )
                                )
                        ),

                        // Saved Templates Section
                        h('div', { className: 'space-y-3 pt-4' },
                             h('div', { className: 'flex items-center gap-2 mb-2' },
                                h('div', { className: "p-1.5 bg-indigo-100 rounded-md" }, h(FolderOpenIcon, { className: "text-indigo-600 w-4 h-4" })),
                                h('h3', { className: 'font-bold text-slate-700 text-sm' }, 'Mis Plantillas')
                            ),
                             h('div', { className: "flex gap-2 mb-3" },
                                h('button', {
                                    onClick: saveTemplate,
                                    className: 'flex-1 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-semibold py-2 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all'
                                }, h(DiskIcon, { className: "w-4 h-4" }), 'Guardar'),
                                h('button', {
                                    onClick: exportTemplate,
                                    className: 'flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-2 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all',
                                    title: "Descargar copia de seguridad"
                                }, h(DownloadIcon, { className: "w-4 h-4" }), 'Exportar'),
                                h('button', {
                                    onClick: () => templateInputRef.current?.click(),
                                    className: 'flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-2 rounded-lg text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all',
                                    title: "Cargar copia de seguridad"
                                }, h(UploadFileIcon, { className: "w-4 h-4" }), 'Importar'),
                                h('input', { ref: templateInputRef, type: 'file', accept: '.json', className: 'hidden', onChange: handleImportTemplate })
                             ),

                            savedTemplates.length === 0 
                                ? h('p', { className: 'text-xs text-slate-400 italic mt-2 text-center' }, 'Guarda el estado actual para reutilizarlo.')
                                : h('div', { className: 'space-y-2 mt-3 max-h-48 overflow-y-auto pr-1' },
                                    savedTemplates.map((tpl, idx) => 
                                        h('div', { key: idx, className: 'flex items-center gap-2' },
                                            h('button', {
                                                onClick: () => loadTemplate(tpl),
                                                className: 'flex-grow text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm bg-white transition-all'
                                            }, 
                                                h('span', { className: 'block font-semibold text-slate-700 text-sm' }, tpl.name),
                                                h('span', { className: 'block text-[10px] text-slate-400 mt-0.5' }, new Date(tpl.date).toLocaleDateString() + ' ' + new Date(tpl.date).toLocaleTimeString())
                                            ),
                                            h('button', {
                                                onClick: () => deleteTemplate(idx),
                                                className: 'text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors'
                                            }, h(TrashIcon, { className: "w-4 h-4" }))
                                        )
                                    )
                                )
                        )
                    )
                )
            )
        ),
        pdfDoc && h('div', { className: 'flex-shrink-0 space-y-4 border-t border-slate-100 pt-6 mt-2' },
            h('div', { className: 'flex items-center justify-between' }, 
                h('button', {
                    className: 'px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white',
                    disabled: currentPage <= 1,
                    onClick: () => setCurrentPage(p => p - 1)
                }, 'Anterior'),
                h('span', { className: 'font-mono text-xs text-slate-500' }, `${currentPage} / ${numPages}`),
                 h('button', {
                    className: 'px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white',
                    disabled: currentPage >= numPages,
                    onClick: () => setCurrentPage(p => p + 1)
                }, 'Siguiente')
            ),
             h('button', {
                className: 'w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-indigo-700/20',
                onClick: generatePdf
             }, 'Exportar Documento PDF')
        )
    );
}

function App() {
    const { useState, useEffect, useCallback, useRef } = React;

    const [pdfFile, setPdfFile] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [elements, setElements] = useState([]);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [zoom, setZoom] = useState(1);
    const [isAutoFitting, setIsAutoFitting] = useState(true);
    const [notification, setNotification] = useState(null); // { message, type: 'success'|'error' }
    
    // History State (Undo/Redo)
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    // Saved Items State (LocalStorage)
    const [savedSignatures, setSavedSignatures] = useState([]);
    const [savedTemplates, setSavedTemplates] = useState([]);
    
    // Drawing Mode State
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [brushSize, setBrushSize] = useState(5); 
    const [isDrawing, setIsDrawing] = useState(false);
    
    // Smart Guides State
    const [guides, setGuides] = useState([]);

    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null); 
    const templateInputRef = useRef(null);
    const fontsCache = useRef({});
    const previewContainerRef = useRef(null);
    const elementsRef = useRef(elements); 
    elementsRef.current = elements; 

    const selectedElement = elements.find(el => el.id === selectedElementId);
    
    // --- LocalStorage Loading ---
    useEffect(() => {
        try {
            const sigs = localStorage.getItem('pdf_filler_signatures');
            if (sigs) setSavedSignatures(JSON.parse(sigs));
            
            const tpls = localStorage.getItem('pdf_filler_templates');
            if (tpls) setSavedTemplates(JSON.parse(tpls));
        } catch (e) {
            console.error("Error loading from local storage", e);
        }
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // --- Signature / Template Functions ---
    const saveSignature = () => {
        if (!selectedElement || selectedElement.type !== 'text') {
            showNotification("Selecciona un texto para guardar", "error");
            return;
        }
        const newSig = { 
            ...selectedElement, 
            id: null, x: null, y: null, page: null // Clear position data
        };
        const updated = [...savedSignatures, newSig];
        setSavedSignatures(updated);
        localStorage.setItem('pdf_filler_signatures', JSON.stringify(updated));
        showNotification("Firma guardada", "success");
    };

    const loadSignature = (sig) => {
        const newElement = {
            ...sig,
            id: generateUUID(),
            page: currentPage,
            x: 50,
            y: 50 + (elements.length * 10), // Cascade slightly
        };
        setElementsWithHistory(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
    };

    const deleteSignature = (index) => {
        const updated = savedSignatures.filter((_, i) => i !== index);
        setSavedSignatures(updated);
        localStorage.setItem('pdf_filler_signatures', JSON.stringify(updated));
    };

    const saveTemplate = () => {
        if (elements.length === 0) {
            showNotification("No hay elementos para guardar.", "error");
            return;
        }
        
        // Auto-generate name with date to avoid prompt blocking
        const date = new Date();
        const name = `Plantilla ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        const newTemplate = {
            name: name,
            date: Date.now(),
            elements: elements
        };
        
        const updated = [...savedTemplates, newTemplate];
        setSavedTemplates(updated);
        localStorage.setItem('pdf_filler_templates', JSON.stringify(updated));
        showNotification("Plantilla guardada correctamente", "success");
    };

    const exportTemplate = () => {
        if (elements.length === 0) {
            showNotification("No hay nada que exportar", "error");
            return;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "docuflow_template.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showNotification("Plantilla descargada", "success");
    };

    const handleImportTemplate = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedElements = JSON.parse(event.target.result);
                if (Array.isArray(importedElements)) {
                    if (confirm("¿Reemplazar los elementos actuales con la plantilla importada?")) {
                        setElementsWithHistory(importedElements);
                        showNotification("Plantilla importada con éxito", "success");
                    }
                } else {
                    throw new Error("Formato inválido");
                }
            } catch (err) {
                showNotification("Error al leer el archivo JSON", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    const loadTemplate = (template) => {
        if (confirm(`¿Cargar plantilla "${template.name}"? Esto reemplazará tu trabajo actual.`)) {
             setElementsWithHistory(template.elements);
             showNotification("Plantilla cargada", "success");
        }
    };
    
    const deleteTemplate = (index) => {
        if(confirm("¿Estás seguro de eliminar esta plantilla?")) {
            const updated = savedTemplates.filter((_, i) => i !== index);
            setSavedTemplates(updated);
            localStorage.setItem('pdf_filler_templates', JSON.stringify(updated));
        }
    };


    // --- Undo/Redo Logic ---
    const addToHistory = useCallback((newElements) => {
        const currentHistory = history.slice(0, historyIndex + 1);
        const nextHistory = [...currentHistory, newElements];
        // Limit history size to 50 steps
        if (nextHistory.length > 50) nextHistory.shift();
        
        setHistory(nextHistory);
        setHistoryIndex(nextHistory.length - 1);
    }, [history, historyIndex]);

    const undo = () => {
        if (historyIndex > 0) {
            const prevElements = history[historyIndex - 1];
            setElements(prevElements);
            setHistoryIndex(historyIndex - 1);
            setSelectedElementId(null);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextElements = history[historyIndex + 1];
            setElements(nextElements);
            setHistoryIndex(historyIndex + 1);
            setSelectedElementId(null);
        }
    };
    
    // Initial history state
    useEffect(() => {
        if (elements.length === 0 && history.length === 0) {
            setHistory([[]]);
            setHistoryIndex(0);
        }
    }, [elements, history]);

    // Wrapper for setElements that optionally adds to history
    const setElementsWithHistory = (newElementsOrUpdater, shouldAddToHistory = true) => {
        setElements(prev => {
            const next = typeof newElementsOrUpdater === 'function' ? newElementsOrUpdater(prev) : newElementsOrUpdater;
            if (shouldAddToHistory) {
                addToHistory(next);
            }
            return next;
        });
    };

    const calculateAndSetFitZoom = useCallback(() => {
        if (!previewContainerRef.current || !canvasSize.width || !canvasSize.height) return;
        
        const container = previewContainerRef.current;
        const padding = 64; 
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;
        
        const scaleX = availableWidth / canvasSize.width;
        const scaleY = availableHeight / canvasSize.height;
        
        const newZoom = Math.min(scaleX, scaleY);
        
        if (newZoom > 0) {
            setZoom(newZoom);
        }
    }, [canvasSize]);

    useEffect(() => {
        if (isAutoFitting) {
            calculateAndSetFitZoom();
        }
    }, [calculateAndSetFitZoom, isAutoFitting]);

    useEffect(() => {
        const handleResize = () => {
            if (isAutoFitting) {
                calculateAndSetFitZoom();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isAutoFitting, calculateAndSetFitZoom]);
    
    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
            
            // Delete
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && !isInputActive) {
                deleteElement(selectedElementId);
            }
            
            // Undo/Redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                redo();
            }
            
            // Duplicate
            if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId && !isInputActive) {
                e.preventDefault();
                duplicateElement();
            }

            // Arrow Keys for Nudging
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedElementId && !isInputActive) {
                e.preventDefault();
                setElements(prev => {
                    const next = prev.map(el => {
                        if (el.id !== selectedElementId) return el;
                        let { x, y } = el;
                        if (e.key === 'ArrowUp') y -= 1;
                        if (e.key === 'ArrowDown') y += 1;
                        if (e.key === 'ArrowLeft') x -= 1;
                        if (e.key === 'ArrowRight') x += 1;
                        return { ...el, x, y };
                    });
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, history, historyIndex]);

    const loadPdf = useCallback(async (file) => {
        if (!file) return;
        setIsLoading(true);
        setLoadingMessage('Cargando PDF...');
        setError('');
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;
            setPdfDoc(pdf);
            setNumPages(pdf.numPages);
            setCurrentPage(1);
            
            // Reset everything
            const empty = [];
            setElements(empty);
            setHistory([empty]);
            setHistoryIndex(0);
            
            setSelectedElementId(null);
            setIsAutoFitting(true);
        } catch (e) {
            setError('Error al cargar el archivo PDF. Asegúrese de que sea un archivo válido.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const renderPage = useCallback(async () => {
        if (!pdfDoc || !canvasRef.current) return;
        
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
        }

        try {
            const page = await pdfDoc.getPage(currentPage);
            const viewport = page.getViewport({ scale: 1.5 }); 
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            if (canvasSize.width !== viewport.width || canvasSize.height !== viewport.height) {
                setCanvasSize({ width: viewport.width, height: viewport.height });
                return;
            }
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            
            const renderTask = page.render(renderContext);
            renderTaskRef.current = renderTask;
            await renderTask.promise;
            renderTaskRef.current = null;
        } catch(e) {
             if (e.name === 'RenderingCancelledException') {
                 return;
             }
             setError('Error al renderizar la página del PDF.');
             console.error(e);
        }
    }, [pdfDoc, currentPage, canvasSize]);

    useEffect(() => {
        renderPage();
        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [renderPage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfFile(file);
            loadPdf(file);
        } else {
            setError('Por favor, selecciona un archivo PDF.');
        }
    };
    
    // UUID seguro
    const uuidv4 = generateUUID;

    const addElement = (props) => {
        if (isDrawingMode) setIsDrawingMode(false); // Turn off drawing if adding text
        const newElement = {
            ...DEFAULT_TEXT_ELEMENT,
            ...props,
            id: uuidv4(),
            page: currentPage,
        };
        setElementsWithHistory(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const ratio = img.width / img.height;
                const width = 200; // Ancho inicial
                const height = width / ratio;
                
                addElement({
                    type: 'image',
                    src: event.target.result,
                    width,
                    height,
                    aspectRatio: ratio,
                    opacity: 1
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };
    
    const duplicateElement = () => {
        if (!selectedElement) return;
        const newElement = {
            ...selectedElement,
            id: uuidv4(),
            x: selectedElement.x + 20,
            y: selectedElement.y + 20
        };
        setElementsWithHistory(prev => [...prev, newElement]);
        setSelectedElementId(newElement.id);
    };
    
    const toggleDrawingMode = () => {
        setIsDrawingMode(prev => !prev);
        setSelectedElementId(null); // Deselect text when drawing
    };
    
    const addSignature = () => {
        if (isDrawingMode) setIsDrawingMode(false);
        addElement({
            text: 'Juan Pérez\\n+1 (555) 123-4567\\njuan.perez@email.com',
            fontFamily: 'Caveat',
            fontSize: 16,
            lineHeight: 1.4,
            x: 100,
            y: canvasSize.height - 200,
        });
    };

    const updateSelectedElement = (props) => {
        if (!selectedElementId) return;
        // Updating text or properties triggers history
        setElementsWithHistory(prev => prev.map(el => el.id === selectedElementId ? { ...el, ...props } : el));
    };
    
    const deleteElement = (id) => {
        setElementsWithHistory(prev => prev.filter(el => el.id !== id));
        if (selectedElementId === id) {
            setSelectedElementId(null);
        }
    };

    // Handle Canvas Drawing and Text Dragging
    const handleCanvasMouseDown = (e) => {
        if (isDrawingMode) {
            // Start Drawing
            setIsDrawing(true);
            const rect = canvasRef.current.getBoundingClientRect();
            // Calculate unzoomed coordinates
            const x = (e.clientX - rect.left) / zoom;
            const y = (e.clientY - rect.top) / zoom;
            
            const newDrawElement = {
                id: uuidv4(),
                type: 'draw',
                page: currentPage,
                points: [x, y], // [x1, y1, x2, y2, ...]
                strokeWidth: brushSize,
                color: 'white'
            };
            
            // Add initial dot, but don't add to history yet (wait for mouseup)
            setElements(prev => [...prev, newDrawElement]);
        } else {
            // Deselect if clicking empty space
            setSelectedElementId(null);
        }
    };

    const handleCanvasMouseMove = (e) => {
        if (isDrawingMode && isDrawing) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoom;
            const y = (e.clientY - rect.top) / zoom;

            // Add point to the last element (which is the current stroke)
            setElements(prev => {
                const lastElement = prev[prev.length - 1];
                if (!lastElement || lastElement.type !== 'draw') return prev;
                
                const newPoints = [...lastElement.points, x, y];
                const updatedElement = { ...lastElement, points: newPoints };
                return [...prev.slice(0, -1), updatedElement];
            });
        }
    };

    const handleCanvasMouseUp = () => {
        if (isDrawingMode && isDrawing) {
            setIsDrawing(false);
            // Add the completed stroke to history
            addToHistory(elements);
        }
    };

    const handleElementMouseDown = (e, element, resizeDirection = null) => {
        if (isDrawingMode) return; // Do not interact with elements while drawing

        e.preventDefault();
        e.stopPropagation();
        setSelectedElementId(element.id);

        const startX = e.clientX / zoom;
        const startY = e.clientY / zoom;
        const elementStartX = element.x;
        const elementStartY = element.y;
        const elementStartWidth = element.width;
        let hasMoved = false;

        // --- SNAP LOGIC SETUP ---
        // Pre-calculate other elements' positions for efficiency
        const otherElements = elementsRef.current.filter(el => el.page === currentPage && el.id !== element.id);
        const SNAP_THRESHOLD = 5; // Pixels
        const pageWidth = canvasSize.width; // This is the viewport width (at 1.5 scale) which is our coordinate space

        const handleMouseMove = (moveEvent) => {
             const currentX = moveEvent.clientX / zoom;
             const currentY = moveEvent.clientY / zoom;
             const dx = currentX - startX;
             const dy = currentY - startY;
             
             if (Math.abs(dx) > 1 || Math.abs(dy) > 1) hasMoved = true;

            if (resizeDirection) {
                if (resizeDirection === 'right') {
                    const newWidth = Math.max(20, elementStartWidth + dx);
                    
                    setElements(prev => prev.map(el => {
                        if (el.id !== element.id) return el;
                        const updates = { width: newWidth };
                        if (el.type === 'image' && el.aspectRatio) {
                             updates.height = newWidth / el.aspectRatio;
                        }
                        return { ...el, ...updates };
                    }));

                } else if (resizeDirection === 'left') {
                    const newWidth = Math.max(20, elementStartWidth - dx);
                    setElements(prev => prev.map(el => {
                        if (el.id !== element.id) return el;
                        const updates = { width: newWidth, x: elementStartX + dx };
                        if (el.type === 'image' && el.aspectRatio) {
                             updates.height = newWidth / el.aspectRatio;
                        }
                        return { ...el, ...updates };
                    }));
                }
            } else {
                // --- MOVING & SNAPPING ---
                let newX = elementStartX + dx;
                let newY = elementStartY + dy;
                
                // --- SMART GUIDES CALCULATION ---
                let snapX = null;
                let snapY = null;
                const currentGuides = [];

                const elWidth = element.width;
                // Approximate height for text if not present
                const elHeight = element.height || (element.fontSize * (element.lineHeight || 1.2));
                
                const elCenterX = newX + elWidth / 2;
                const elCenterY = newY + elHeight / 2;

                // 1. Center of Page Snap
                if (Math.abs(elCenterX - pageWidth / 2) < SNAP_THRESHOLD) {
                    snapX = (pageWidth / 2) - (elWidth / 2);
                    currentGuides.push({ type: 'vertical', x: pageWidth / 2 });
                }

                // 2. Element-to-Element Snap
                otherElements.forEach(other => {
                    const otherWidth = other.width;
                    const otherHeight = other.height || (other.fontSize * (other.lineHeight || 1.2));
                    const otherCenterX = other.x + otherWidth / 2;
                    const otherCenterY = other.y + otherHeight / 2;

                    // Vertical Alignments (X-axis)
                    // Left to Left
                    if (Math.abs(newX - other.x) < SNAP_THRESHOLD) {
                        snapX = other.x;
                        currentGuides.push({ type: 'vertical', x: other.x });
                    }
                    // Left to Right (My Left to Other Right)
                    if (Math.abs(newX - (other.x + otherWidth)) < SNAP_THRESHOLD) {
                        snapX = other.x + otherWidth;
                        currentGuides.push({ type: 'vertical', x: other.x + otherWidth });
                    }
                    // Right to Left (My Right to Other Left)
                    if (Math.abs((newX + elWidth) - other.x) < SNAP_THRESHOLD) {
                        snapX = other.x - elWidth;
                        currentGuides.push({ type: 'vertical', x: other.x });
                    }
                    // Center to Center
                    if (Math.abs(elCenterX - otherCenterX) < SNAP_THRESHOLD) {
                        snapX = otherCenterX - (elWidth / 2);
                        currentGuides.push({ type: 'vertical', x: otherCenterX });
                    }

                    // Horizontal Alignments (Y-axis)
                    // Top to Top
                    if (Math.abs(newY - other.y) < SNAP_THRESHOLD) {
                        snapY = other.y;
                        currentGuides.push({ type: 'horizontal', y: other.y });
                    }
                     // Center to Center
                    if (Math.abs(elCenterY - otherCenterY) < SNAP_THRESHOLD) {
                        snapY = otherCenterY - (elHeight / 2);
                        currentGuides.push({ type: 'horizontal', y: otherCenterY });
                    }
                });

                if (snapX !== null) newX = snapX;
                if (snapY !== null) newY = snapY;
                
                setGuides(currentGuides);

                setElements(prev => prev.map(el => el.id === element.id ? { ...el, x: newX, y: newY } : el));
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            setGuides([]); // Clear guides on release
            // Only add to history if the element actually changed position/size
            if (hasMoved) {
                addToHistory(elementsRef.current);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    
    const fetchFont = async (fontName) => {
        if (fontsCache.current[fontName]) {
            return fontsCache.current[fontName];
        }
        const font = FONT_FAMILIES.find(f => f.name === fontName);
        if (font && font.type === 'google') {
            const response = await fetch(GOOGLE_FONTS[fontName]);
            const fontBytes = await response.arrayBuffer();
            fontsCache.current[fontName] = fontBytes;
            return fontBytes;
        }
        return null;
    };

    const generatePdf = async () => {
        if (!pdfFile) {
            setError('Primero carga un archivo PDF.');
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Generando PDF...');

        try {
            const existingPdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
            
            // --- REGISTRO DE FONTKIT ---
            // Importante para poder incrustar fuentes personalizadas (TTF/OTF)
            pdfDoc.registerFontkit(fontkit);

            const fontPromises = elements
                .filter(el => el.type === 'text') // Only load fonts for text elements
                .map(el => fetchFont(el.fontFamily));
            await Promise.all(fontPromises);

            const pages = pdfDoc.getPages();

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { height } = page.getSize();
                const pageElements = elements.filter(el => el.page === i + 1);
                
                const pdfPage = await pdfjsLib.getDocument(await pdfFile.arrayBuffer()).promise.then(doc => doc.getPage(i + 1));
                const originalViewport = pdfPage.getViewport({ scale: 1.5 });
                const scaleFactor = height / originalViewport.height;

                if (!scaleFactor || isNaN(scaleFactor)) {
                    console.error("Invalid scale factor");
                    continue;
                }

                for (const el of pageElements) {
                    if (el.type === 'draw') {
                        // Draw strokes
                        if (!el.points || el.points.length < 4) continue;
                        
                        for(let j = 0; j < el.points.length - 2; j+=2) {
                            const x1 = el.points[j] * scaleFactor;
                            const y1 = el.points[j+1] * scaleFactor;
                            const x2 = el.points[j+2] * scaleFactor;
                            const y2 = el.points[j+3] * scaleFactor;
                            
                            page.drawLine({
                                start: { x: x1, y: height - y1 },
                                end: { x: x2, y: height - y2 },
                                thickness: el.strokeWidth * scaleFactor,
                                color: rgb(1, 1, 1),
                                opacity: 1,
                                lineCap: LineCapStyle.Round,
                                lineJoin: LineJoinStyle.Round
                            });
                        }
                        continue;
                    }
                    
                    if (el.type === 'image') {
                        try {
                            let pdfImage;
                            const imgBytes = await fetch(el.src).then(res => res.arrayBuffer());
                            
                            // Naive MIME detection
                            if (el.src.startsWith('data:image/png')) {
                                pdfImage = await pdfDoc.embedPng(imgBytes);
                            } else {
                                pdfImage = await pdfDoc.embedJpg(imgBytes);
                            }

                            const scaledX = el.x * scaleFactor;
                            const scaledY = el.y * scaleFactor;
                            const scaledWidth = el.width * scaleFactor;
                            const scaledHeight = el.height * scaleFactor;

                            page.drawImage(pdfImage, {
                                x: scaledX,
                                y: height - scaledY - scaledHeight,
                                width: scaledWidth,
                                height: scaledHeight,
                                opacity: el.opacity || 1
                            });
                        } catch (err) {
                            console.error("Error embedding image", err);
                        }
                        continue;
                    }

                    // --- TEXT RENDERING ---
                    const scaledX = el.x * scaleFactor;
                    const scaledY = el.y * scaleFactor;
                    const scaledWidth = el.width * scaleFactor;
                    const scaledFontSize = el.fontSize * scaleFactor;
                    
                    let pdfFont;
                    try {
                        const fontBytes = fontsCache.current[el.fontFamily];
                        if (fontBytes) {
                            pdfFont = await pdfDoc.embedFont(fontBytes);
                        } 
                    } catch (e) {
                        console.error('Error loading custom font', e);
                    }

                    if (!pdfFont) {
                        const isTimes = el.fontFamily === 'Times-Roman';
                        const isBold = el.fontWeight === 'bold';
                        // Use string literals instead of StandardFonts enum to be safer
                        const standardFont = isTimes 
                            ? (isBold ? 'Times-Roman-Bold' : 'Times-Roman')
                            : (isBold ? 'Helvetica-Bold' : 'Helvetica');
                        try {
                            pdfFont = await pdfDoc.embedFont(standardFont);
                        } catch (e) {
                            console.error("Fallback font failed", e);
                            // Ultimate fallback
                            pdfFont = await pdfDoc.embedFont('Helvetica'); 
                        }
                    }
                    
                    if (!pdfFont) continue;
                    
                    let r = 0, g = 0, b = 0;
                    const colorHex = el.color || '#000000';
                    const colorMatch = colorHex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
                    
                    if (colorMatch) {
                        r = parseInt(colorMatch[1], 16) / 255;
                        g = parseInt(colorMatch[2], 16) / 255;
                        b = parseInt(colorMatch[3], 16) / 255;
                    }
                    
                    const textContent = el.text || '';
                    const lineHeightPx = el.lineHeight * scaledFontSize;
                    const textColor = rgb(r, g, b);

                    // Manual Text Wrapping and Line Breaking
                    const paragraphs = textContent.replace(/\\n/g, '\n').replace(/\r/g, '').replace(/\t/g, ' ').split('\n');
                    let currentY = height - scaledY - scaledFontSize; // Starting Baseline

                    for (const paragraph of paragraphs) {
                        // Handle empty lines
                        if (paragraph.length === 0) {
                            currentY -= lineHeightPx;
                            continue;
                        }
                        
                        const words = paragraph.split(' ');
                        let currentLine = '';
                        
                        for (let n = 0; n < words.length; n++) {
                            const word = words[n];
                            const testLine = currentLine ? `${currentLine} ${word}` : word;
                            const testWidth = pdfFont.widthOfTextAtSize(testLine, scaledFontSize);
                            
                            if (testWidth > scaledWidth && currentLine !== '') {
                                // Draw the current line
                                let drawX = scaledX;
                                const lineWidth = pdfFont.widthOfTextAtSize(currentLine, scaledFontSize);
                                if(el.textAlign === 'center') drawX = scaledX + (scaledWidth - lineWidth) / 2;
                                if(el.textAlign === 'right') drawX = scaledX + scaledWidth - lineWidth;

                                page.drawText(currentLine, {
                                    x: drawX,
                                    y: currentY,
                                    font: pdfFont,
                                    size: scaledFontSize,
                                    color: textColor,
                                });
                                
                                currentY -= lineHeightPx;
                                currentLine = word;
                            } else {
                                currentLine = testLine;
                            }
                        }
                        
                        // Draw the last line of the paragraph
                        if (currentLine) {
                            let drawX = scaledX;
                            const lineWidth = pdfFont.widthOfTextAtSize(currentLine, scaledFontSize);
                            if(el.textAlign === 'center') drawX = scaledX + (scaledWidth - lineWidth) / 2;
                            if(el.textAlign === 'right') drawX = scaledX + scaledWidth - lineWidth;

                            page.drawText(currentLine, {
                                x: drawX,
                                y: currentY,
                                font: pdfFont,
                                size: scaledFontSize,
                                color: textColor,
                            });
                            currentY -= lineHeightPx;
                        }
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `filled_${pdfFile.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            setError('Ocurrió un error al generar el PDF. Intenta usar fuentes estándar si falla con especiales.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const ZoomControls = () => h('div', { className: 'zoom-controls' },
        h('div', { className: 'flex items-center bg-slate-900/90 text-white backdrop-blur-md rounded-full shadow-xl border border-white/10 p-1.5 space-x-1' },
            h('button', { className: 'p-2 rounded-full hover:bg-white/20 transition-colors', onClick: () => { setZoom(z => z / 1.2); setIsAutoFitting(false); } }, h(MinusIcon)),
            h('button', { className: 'p-2 px-3 rounded-full hover:bg-white/10 transition-colors font-mono text-xs', onClick: () => { setZoom(1); setIsAutoFitting(false); } }, `${Math.round(zoom * 100)}%`),
            h('button', { className: 'p-2 rounded-full hover:bg-white/20 transition-colors', onClick: () => { setZoom(z => z * 1.2); setIsAutoFitting(false); } }, h(PlusIcon)),
            h('div', { className: 'w-px h-4 bg-white/20 mx-1' }),
            h('button', { className: 'p-2 rounded-full hover:bg-white/20 transition-colors', title: "Ajustar a Pantalla", onClick: () => setIsAutoFitting(true) }, h(FitScreenIcon))
        )
    );

    const formState = selectedElement || DEFAULT_TEXT_ELEMENT;

    return h('div', { className: 'h-screen w-screen flex flex-col font-sans text-slate-900' },
        h('header', { className: 'bg-slate-900 text-white shadow-lg p-3 px-6 flex-shrink-0 z-20 flex items-center justify-between' },
            h('div', { className: "flex items-center gap-3" },
                h('div', { className: "w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50" }, 
                    h(DocIcon, { className: "w-5 h-5 text-white" })
                ),
                h('div', {}, 
                    h('h1', { className: 'text-xl font-bold tracking-tight' }, 'DocuFlow'),
                    h('p', { className: 'text-[10px] text-slate-400 font-medium tracking-wider uppercase' }, 'Editor PDF Profesional')
                )
            ),
            h('div', { className: 'text-xs text-slate-400 hidden md:block' }, 'v2.1 • Edición Segura Local')
        ),
        h('main', { className: 'flex-grow grid grid-cols-1 lg:grid-cols-3 overflow-hidden bg-slate-100' },
            
            h(ControlPanel, { 
                pdfDoc, pdfFile, numPages, currentPage, setCurrentPage, generatePdf, fileInputRef, handleFileChange,
                selectedElementId, formState, updateSelectedElement, addElement, duplicateElement, addSignature, 
                toggleDrawingMode, isDrawingMode, brushSize, setBrushSize,
                elements, deleteElement, setSelectedElementId,
                undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1,
                savedSignatures, saveSignature, loadSignature, deleteSignature,
                savedTemplates, saveTemplate, loadTemplate, deleteTemplate,
                exportTemplate, handleImportTemplate, templateInputRef,
                handleImageUpload, imageInputRef
            }),

            h('div', { className: 'lg:col-span-2 relative h-full overflow-hidden bg-slate-100' }, // Contenedor Fijo (Marco)
                // Área de desplazamiento
                h('div', { 
                    className: 'h-full w-full overflow-auto p-4 lg:p-8 dot-pattern flex items-start justify-center', // Área scrolleable
                    ref: previewContainerRef, 
                    onClick: () => setSelectedElementId(null) 
                },
                    pdfDoc && h(React.Fragment, null,
                        h('div', { 
                            className: `canvas-wrapper transition-all duration-300 ease-out ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`, 
                            style: { 
                                width: canvasSize.width, 
                                height: canvasSize.height, 
                                transform: `scale(${zoom})`, 
                                transformOrigin: 'center top',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)' 
                            },
                            onMouseDown: handleCanvasMouseDown,
                            onMouseMove: handleCanvasMouseMove,
                            onMouseUp: handleCanvasMouseUp,
                            onMouseLeave: handleCanvasMouseUp
                        },
                            h('canvas', { ref: canvasRef }),
                            // Render Drawing Elements & Guides (SVG Layer)
                            h('svg', { 
                                className: 'absolute top-0 left-0 w-full h-full pointer-events-none',
                                style: { zIndex: 1 }
                            }, 
                                // Render Smart Guides (Magenta Lines)
                                guides.map((guide, i) => h('line', {
                                    key: `guide-${i}`,
                                    x1: guide.type === 'vertical' ? guide.x : 0,
                                    y1: guide.type === 'horizontal' ? guide.y : 0,
                                    x2: guide.type === 'vertical' ? guide.x : canvasSize.width,
                                    y2: guide.type === 'horizontal' ? guide.y : canvasSize.height,
                                    stroke: '#d946ef', // Fuchsia-500
                                    strokeWidth: 1 / zoom, 
                                    strokeDasharray: `${4 / zoom} ${2 / zoom}`,
                                    opacity: 0.8
                                })),
                                // Render Strokes
                                elements
                                    .filter(el => el.page === currentPage && el.type === 'draw')
                                    .map(el => {
                                        const pointsStr = el.points.reduce((acc, val, i, arr) => {
                                            if (i % 2 === 0) return acc + `${val},${arr[i+1]} `;
                                            return acc;
                                        }, '').trim();
                                        
                                        return h('polyline', {
                                            key: el.id,
                                            points: pointsStr,
                                            fill: 'none',
                                            stroke: 'white',
                                            strokeWidth: el.strokeWidth,
                                            strokeLinecap: 'round',
                                            strokeLinejoin: 'round'
                                        });
                                    })
                            ),
                            // Render Elements
                            ...elements.filter(el => el.page === currentPage && el.type !== 'draw').map(element => {
                                if (element.type === 'image') {
                                    return h('div', {
                                        key: element.id,
                                        className: `text-element group ${selectedElementId === element.id ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-1 hover:ring-indigo-300'}`,
                                        style: {
                                            left: element.x,
                                            top: element.y,
                                            width: element.width,
                                            height: element.height,
                                            zIndex: 2
                                        },
                                        onMouseDown: (e) => handleElementMouseDown(e, element),
                                        onClick: (e) => { e.stopPropagation(); setSelectedElementId(element.id); }
                                    },
                                        h('img', { 
                                            src: element.src, 
                                            className: 'w-full h-full object-contain pointer-events-none select-none',
                                            style: { opacity: element.opacity || 1 }
                                        }),
                                        selectedElementId === element.id && !isDrawingMode && h(React.Fragment, null,
                                            h('div', { className: 'resize-handle resize-handle-left bg-indigo-500 w-2.5 h-full absolute left-[-5px] rounded-l cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity', onMouseDown: e => handleElementMouseDown(e, element, 'left') }),
                                            h('div', { className: 'resize-handle resize-handle-right bg-indigo-500 w-2.5 h-full absolute right-[-5px] rounded-r cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity', onMouseDown: e => handleElementMouseDown(e, element, 'right') })
                                        )
                                    );
                                }
                                
                                // Text Elements
                                return h('div', {
                                    key: element.id,
                                    className: `text-element group ${selectedElementId === element.id ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-1 hover:ring-indigo-300'}`,
                                    style: {
                                        left: element.x,
                                        top: element.y,
                                        width: element.width,
                                        fontSize: element.fontSize,
                                        fontFamily: `"${element.fontFamily}"`,
                                        fontWeight: element.fontWeight,
                                        textAlign: element.textAlign,
                                        lineHeight: element.lineHeight,
                                        color: element.color,
                                        zIndex: 2
                                    },
                                    onMouseDown: (e) => handleElementMouseDown(e, element),
                                    onClick: (e) => { e.stopPropagation(); setSelectedElementId(element.id); }
                                }, 
                                    (element.text || '').replace(/\\n/g, '\n'),
                                    selectedElementId === element.id && !isDrawingMode && h(React.Fragment, null,
                                        h('div', { className: 'resize-handle resize-handle-left bg-indigo-500 w-2.5 h-full absolute left-[-5px] rounded-l cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity', onMouseDown: e => handleElementMouseDown(e, element, 'left') }),
                                        h('div', { className: 'resize-handle resize-handle-right bg-indigo-500 w-2.5 h-full absolute right-[-5px] rounded-r cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity', onMouseDown: e => handleElementMouseDown(e, element, 'right') })
                                    )
                                );
                            })
                        )
                    )
                ),
                // Controles de Zoom (Fuera del área de scroll)
                pdfDoc && h(ZoomControls)
            ),
            h(Notification, { message: notification?.message, type: notification?.type })
        ),
         (isLoading || error) && h('div', { className: 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200' },
            isLoading ? h('div', { className: 'bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-4' },
                h('div', { className: 'relative w-16 h-16 mx-auto mb-6' },
                    h('div', { className: 'absolute inset-0 border-4 border-slate-100 rounded-full' }),
                    h('div', { className: 'absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin' })
                ),
                h('p', { className: 'text-lg font-bold text-slate-800' }, loadingMessage || 'Procesando...'),
                h('p', { className: 'text-sm text-slate-500 mt-2' }, 'Estamos preparando tu documento.')
            ) :
            error && h('div', { className: 'bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border-l-4 border-red-500' },
                h('div', { className: "flex items-start gap-3" },
                     h('div', { className: "text-red-500 bg-red-50 p-2 rounded-full" }, 
                        h('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }))
                     ),
                     h('div', {},
                        h('h3', { className: 'text-lg font-bold text-slate-800' }, '¡Ups! Algo salió mal'),
                        h('p', { className: 'text-sm text-slate-600 mt-1 leading-relaxed' }, error),
                     )
                ),
                h('button', { 
                    onClick: () => setError(''),
                    className: 'w-full bg-slate-100 text-slate-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-200 mt-5 transition-colors'
                }, 'Entendido')
            )
        )
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));