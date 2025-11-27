import React from "react";
import ReactDOM from "react-dom/client";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from "pdf-lib";

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

const Icon = ({ path, className = "w-5 h-5" }) => h('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className }, h('path', { fillRule: "evenodd", d: path, clipRule: "evenodd" }));
const UploadIcon = () => h(Icon, { path: "M9.47 1.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1-1.06 1.06L10 3.06 6.28 6.78a.75.75 0 0 1-1.06-1.06l4.25-4.25ZM3.25 9.75a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 0 .75.75h10.5a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 1 1.5 0v3.75a2.25 2.25 0 0 1-2.25 2.25H4.75A2.25 2.25 0 0 1 2.5 14.25V10.5a.75.75 0 0 1 .75-.75Z" });
const PlusIcon = () => h(Icon, { path: "M10 3a.75.75 0 0 1 .75.75v6.5h6.5a.75.75 0 0 1 0 1.5h-6.5v6.5a.75.75 0 0 1-1.5 0v-6.5H2.25a.75.75 0 0 1 0-1.5h6.5V3.75A.75.75 0 0 1 10 3Z" });
const TrashIcon = () => h(Icon, { path: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.53 6.53a.75.75 0 0 1 1.06-1.06L10 8.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L11.06 10l2.47 2.47a.75.75 0 1 1-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L8.94 10 6.53 7.53Z" });
const MinusIcon = () => h(Icon, { path: "M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Z" });
const FitScreenIcon = () => h(Icon, { path: "M3 8.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H4.5v2.25a.75.75 0 0 1-1.5 0V8.25ZM15.5 6h2.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V8.25h-2.25a.75.75 0 0 1 0-1.5ZM8.25 3a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5H9v2.25a.75.75 0 0 1-1.5 0V7.5H5.25a.75.75 0 0 1 0-1.5H7.5V3.75A.75.75 0 0 1 8.25 3ZM11.75 16a.75.75 0 0 1-.75-.75v-2.25h-2.25a.75.75 0 0 1 0-1.5H11v-2.25a.75.75 0 0 1 1.5 0V11.5h2.25a.75.75 0 0 1 0 1.5H12.5v2.25a.75.75 0 0 1-.75.75Z", clipRule: "evenodd" });
const BrushIcon = () => h(Icon, { path: "M15.207 3.793a1 1 0 0 1 0 1.414L8.5 12h-3a1 1 0 0 1-1-1v-3l6.793-6.793a1 1 0 0 1 1.414 0ZM11.5 15a2.5 2.5 0 0 0-2.5 2.5h5A2.5 2.5 0 0 0 11.5 15Z" });

const InputGroup = ({ label, children }) => h('div', { className: 'flex flex-col gap-1' }, h('label', { className: 'text-sm font-medium text-slate-600' }, label), children);
const NumberInput = ({ value, onChange }) => h('input', { type: 'number', className: 'w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-sky-500', value, onChange });

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
    addSignature,
    toggleDrawingMode,
    isDrawingMode,
    brushSize,
    setBrushSize,
    elements,
    deleteElement,
    setSelectedElementId
}) => {
    const isDraw = formState.type === 'draw';

    return h('div', { className: 'flex flex-col h-full bg-white p-4 lg:p-6 border-r border-slate-200 overflow-y-auto' },
        h('div', { className: 'space-y-6 flex-grow' },
            h('div', {},
                h('h2', { className: 'text-lg font-bold text-slate-800' }, 'Panel de Controles'),
                h('p', { className: 'text-sm text-slate-500' }, 'Añade texto o usa el pincel corrector.')
            ),
            
            !pdfDoc && h('div', { className: 'flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg bg-slate-50' },
                h(UploadIcon, { className: 'w-12 h-12 text-slate-400 mb-2' }),
                h('p', { className: 'font-semibold' }, 'Sube un archivo PDF'),
                h('p', { className: 'text-sm text-slate-500 mb-4' }, 'Haz clic en el botón para empezar.'),
                 h('button', {
                    className: 'w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2',
                    onClick: () => fileInputRef.current?.click()
                }, h(UploadIcon), 'Seleccionar PDF'),
                h('input', { ref: fileInputRef, type: 'file', accept: '.pdf', className: 'hidden', onChange: handleFileChange })
            ),

            pdfDoc && h(React.Fragment, null, 
                h('div', { className: 'p-4 bg-sky-50 border border-sky-200 rounded-lg text-sm text-sky-800' },
                    `PDF cargado: ${pdfFile?.name || ''}. Total de páginas: ${numPages}.`
                ),
                
                h('div', { className: 'space-y-4 border-t pt-4' },
                    
                    // Toolbar
                    h('div', { className: 'flex flex-col gap-3 pb-4 border-b' },
                        h('h3', { className: 'font-semibold text-md' }, 'Herramientas'),
                        h('div', { className: 'grid grid-cols-2 gap-2' },
                            h('button', { 
                                className: `w-full font-bold py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border ${!isDrawingMode ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`, 
                                onClick: () => { 
                                    if(isDrawingMode) toggleDrawingMode(); 
                                    addElement(DEFAULT_TEXT_ELEMENT); 
                                } 
                            }, h(PlusIcon, { className: "w-4 h-4" }), 'Añadir Texto'),
                            
                            h('button', { 
                                className: `w-full font-bold py-2 px-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border ${isDrawingMode ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`, 
                                onClick: toggleDrawingMode 
                            }, h(BrushIcon, { className: "w-4 h-4" }), isDrawingMode ? 'Pincel Activo' : 'Pincel Borrador')
                        ),
                        
                        // Brush Settings (only visible when drawing mode is active)
                        isDrawingMode && h('div', { className: 'bg-slate-100 p-3 rounded-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-200' },
                            h('label', { className: 'text-xs font-semibold text-slate-600 uppercase flex justify-between' }, 
                                'Grosor del Pincel', 
                                h('span', {}, `${brushSize}px`)
                            ),
                            h('input', { 
                                type: 'range', 
                                min: '5', 
                                max: '50', 
                                value: brushSize, 
                                onChange: (e) => setBrushSize(parseInt(e.target.value)),
                                className: 'w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600'
                            }),
                            h('p', { className: 'text-xs text-slate-500' }, 'Dibuja sobre el PDF para borrar contenido.')
                        )
                    ),

                    // Element Properties (only visible if an element is selected AND we are not in drawing mode)
                    selectedElementId && !isDrawingMode && h('div', { className: 'space-y-4 animate-in fade-in duration-200' },
                        h('h3', { className: 'font-semibold text-md' }, isDraw ? 'Editar Trazo' : 'Editar Texto'),
                        
                        !isDraw && h(InputGroup, { label: 'Texto' }, h('textarea', {
                            className: 'w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-sky-500',
                            rows: 3,
                            value: formState.text || '',
                            onChange: e => updateSelectedElement({ text: e.target.value })
                        })),

                        !isDraw && h('div', { className: 'grid grid-cols-2 gap-4' },
                            h(InputGroup, { label: 'Posición X' }, h(NumberInput, { value: formState.x, onChange: e => updateSelectedElement({ x: parseInt(e.target.value, 10) }) })),
                            h(InputGroup, { label: 'Posición Y' }, h(NumberInput, { value: formState.y, onChange: e => updateSelectedElement({ y: parseInt(e.target.value, 10) }) }))
                        ),

                        !isDraw && h('div', { className: 'grid grid-cols-2 gap-4' },
                            h(InputGroup, { label: 'Ancho' }, h(NumberInput, { value: formState.width, onChange: e => updateSelectedElement({ width: parseInt(e.target.value, 10) }) })),
                            h(InputGroup, { label: 'Tamaño Fuente' }, h(NumberInput, { value: formState.fontSize, onChange: e => updateSelectedElement({ fontSize: parseInt(e.target.value, 10) }) }))
                        ),

                        !isDraw && h(React.Fragment, null,
                            h(InputGroup, { label: 'Familia de Fuente' },
                                h('select', { 
                                    className: 'w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-sky-500',
                                    value: formState.fontFamily,
                                    onChange: e => updateSelectedElement({ fontFamily: e.target.value }) 
                                }, ...FONT_FAMILIES.map(font => h('option', { value: font.name }, font.label || font.name)))
                            ),
                            h('div', { className: 'grid grid-cols-2 gap-4' },
                                h(InputGroup, { label: 'Peso' }, h('select', { className: 'w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-sky-500', value: formState.fontWeight, onChange: e => updateSelectedElement({ fontWeight: e.target.value }) }, h('option', { value: 'normal' }, 'Normal'), h('option', { value: 'bold' }, 'Negrita'))),
                                h(InputGroup, { label: 'Alineación' }, h('select', { className: 'w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-sky-500', value: formState.textAlign, onChange: e => updateSelectedElement({ textAlign: e.target.value }) }, h('option', { value: 'left' }, 'Izquierda'), h('option', { value: 'center' }, 'Centro'), h('option', { value: 'right' }, 'Derecha')))
                            ),
                            h('div', { className: 'grid grid-cols-2 gap-4 items-center' },
                                    h(InputGroup, { label: 'Interlineado' }, h(NumberInput, { value: formState.lineHeight, onChange: e => updateSelectedElement({ lineHeight: parseFloat(e.target.value) }) })),
                                    h(InputGroup, { label: 'Color' }, h('input', { type: 'color', className: 'w-full h-10 border-0 cursor-pointer rounded-md', value: formState.color, onChange: e => updateSelectedElement({ color: e.target.value }) }))
                            )
                        ),
                        
                        // Simple delete button for any selected element
                        h('button', { 
                             className: 'w-full bg-red-50 text-red-600 border border-red-200 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm mt-4', 
                             onClick: () => deleteElement(selectedElementId)
                         }, h(TrashIcon, { className: "w-4 h-4" }), 'Eliminar Elemento Seleccionado')
                    ),
                    
                    !isDrawingMode && h('div', { className: 'pt-2' },
                        h('button', { className: 'w-full bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm', onClick: addSignature }, 'Añadir Firma Ejemplo')
                    )
                ),

                elements.filter(el => el.page === currentPage).length > 0 && h('div', { className: 'border-t pt-4' },
                    h('h3', { className: 'font-semibold text-md mb-2' }, `Capas en Página ${currentPage}`),
                    h('ul', { className: 'space-y-2 max-h-48 overflow-y-auto' }, 
                        ...elements.filter(el => el.page === currentPage).map(el => 
                            h('li', { 
                                key: el.id, 
                                className: `flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer ${selectedElementId === el.id ? 'bg-sky-100' : 'bg-slate-50'}`,
                                onClick: () => {
                                    if (isDrawingMode) toggleDrawingMode(); // Exit drawing mode to select list item
                                    setSelectedElementId(el.id);
                                }
                            },
                                h('div', { className: 'flex items-center gap-2 overflow-hidden' },
                                    el.type === 'draw' ? h(BrushIcon, { className: "w-4 h-4 text-slate-500" }) : h('span', { className: 'text-xs font-bold text-sky-600' }, 'T'),
                                    h('span', { className: 'truncate text-sm' }, el.type === 'draw' ? 'Trazo Borrador' : (el.text || '').split('\\n')[0])
                                ),
                                h('button', { onClick: (e) => { e.stopPropagation(); deleteElement(el.id); }, className: 'text-slate-400 hover:text-red-500' }, h(TrashIcon, { className: 'w-4 h-4' }))
                            )
                        )
                    )
                )
            )
        ),
        pdfDoc && h('div', { className: 'flex-shrink-0 space-y-4 border-t pt-4 mt-4' },
            h('div', { className: 'flex items-center justify-between' }, 
                h('button', {
                    className: 'px-4 py-2 bg-white border rounded-md shadow-sm disabled:opacity-50',
                    disabled: currentPage <= 1,
                    onClick: () => setCurrentPage(p => p - 1)
                }, 'Anterior'),
                h('span', { className: 'font-semibold text-sm' }, `Página ${currentPage} de ${numPages}`),
                 h('button', {
                    className: 'px-4 py-2 bg-white border rounded-md shadow-sm disabled:opacity-50',
                    disabled: currentPage >= numPages,
                    onClick: () => setCurrentPage(p => p + 1)
                }, 'Siguiente')
            ),
             h('button', {
                className: 'w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors',
                onClick: generatePdf
             }, 'Generar y Descargar PDF')
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
    
    // Drawing Mode State
    const [isDrawingMode, setIsDrawingMode] = useState(false);
    const [brushSize, setBrushSize] = useState(15);
    const [isDrawing, setIsDrawing] = useState(false);

    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);
    const fileInputRef = useRef(null);
    const fontsCache = useRef({});
    const previewContainerRef = useRef(null);

    const selectedElement = elements.find(el => el.id === selectedElementId);
    
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
            setElements([]);
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
        setElements(prev => [...prev, newElement]);
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
        setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, ...props } : el));
    };
    
    const deleteElement = (id) => {
        setElements(prev => prev.filter(el => el.id !== id));
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
            
            setElements(prev => [...prev, newDrawElement]);
            // We don't set selectedElementId here to avoid showing properties while drawing
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
        setIsDrawing(false);
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

        const handleMouseMove = (moveEvent) => {
             const currentX = moveEvent.clientX / zoom;
             const currentY = moveEvent.clientY / zoom;
             const dx = currentX - startX;
             const dy = currentY - startY;

            if (resizeDirection) {
                if (resizeDirection === 'right') {
                    const newWidth = Math.max(20, elementStartWidth + dx);
                    setElements(prev => prev.map(el => el.id === element.id ? { ...el, width: newWidth } : el));
                } else if (resizeDirection === 'left') {
                    const newWidth = Math.max(20, elementStartWidth - dx);
                    setElements(prev => prev.map(el => el.id === element.id ? { ...el, width: newWidth, x: elementStartX + dx } : el));
                }
            } else {
                setElements(prev => prev.map(el => el.id === element.id ? { ...el, x: elementStartX + dx, y: elementStartY + dy } : el));
            }
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
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

                    // Manual Text Wrapping and Line Breaking to avoid WinAnsi encoding issues with StandardFonts
                    // Split by newline chars, remove CR to be safe
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
        h('div', { className: 'flex items-center bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-1 space-x-1' },
            h('button', { className: 'p-2 rounded-md hover:bg-slate-100', onClick: () => { setZoom(z => z / 1.2); setIsAutoFitting(false); } }, h(MinusIcon)),
            h('button', { className: 'p-2 rounded-md hover:bg-slate-100', onClick: () => { setZoom(1); setIsAutoFitting(false); } }, h('span', { className: 'text-sm font-semibold w-12 text-center' }, `${Math.round(zoom * 100)}%`)),
            h('button', { className: 'p-2 rounded-md hover:bg-slate-100', onClick: () => { setZoom(z => z * 1.2); setIsAutoFitting(false); } }, h(PlusIcon)),
            h('div', { className: 'w-px h-5 bg-slate-200 mx-1' }),
            h('button', { className: 'p-2 rounded-md hover:bg-slate-100', onClick: () => setIsAutoFitting(true) }, h(FitScreenIcon))
        )
    );

    const formState = selectedElement || DEFAULT_TEXT_ELEMENT;

    return h('div', { className: 'h-screen w-screen flex flex-col' },
        h('header', { className: 'bg-white shadow-md p-4 flex-shrink-0 z-10' },
            h('h1', { className: 'text-2xl font-bold text-sky-700' }, 'Rellenador de Plantillas PDF'),
            h('p', { className: 'text-slate-600' }, 'Sube un PDF, añade texto y descarga tu documento finalizado.')
        ),
        h('main', { className: 'flex-grow grid grid-cols-1 lg:grid-cols-3 overflow-hidden' },
            
            h(ControlPanel, { 
                pdfDoc, pdfFile, numPages, currentPage, setCurrentPage, generatePdf, fileInputRef, handleFileChange,
                selectedElementId, formState, updateSelectedElement, addElement, addSignature, 
                toggleDrawingMode, isDrawingMode, brushSize, setBrushSize,
                elements, deleteElement, setSelectedElementId
            }),

            h('div', { className: 'lg:col-span-2 bg-slate-200 p-4 lg:p-8 preview-container', ref: previewContainerRef, onClick: () => setSelectedElementId(null) },
                 pdfDoc && h(React.Fragment, null,
                    h('div', { 
                        className: `canvas-wrapper ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`, 
                        style: { width: canvasSize.width, height: canvasSize.height, transform: `scale(${zoom})`, transformOrigin: 'center top' },
                        onMouseDown: handleCanvasMouseDown,
                        onMouseMove: handleCanvasMouseMove,
                        onMouseUp: handleCanvasMouseUp,
                        onMouseLeave: handleCanvasMouseUp
                    },
                        h('canvas', { ref: canvasRef }),
                        // Render Drawing Elements (SVG Layer)
                        h('svg', { 
                            className: 'absolute top-0 left-0 w-full h-full pointer-events-none',
                            style: { zIndex: 1 }
                        }, 
                            elements
                                .filter(el => el.page === currentPage && el.type === 'draw')
                                .map(el => {
                                    // Convert flat array [x1,y1,x2,y2] to "x1,y1 x2,y2"
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
                        // Render Text Elements
                        ...elements.filter(el => el.page === currentPage && el.type === 'text').map(element => h('div', {
                            key: element.id,
                            className: `text-element ${selectedElementId === element.id ? 'selected' : ''}`,
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
                                h('div', { className: 'resize-handle resize-handle-left', onMouseDown: e => handleElementMouseDown(e, element, 'left') }),
                                h('div', { className: 'resize-handle resize-handle-right', onMouseDown: e => handleElementMouseDown(e, element, 'right') })
                            )
                        ))
                    ),
                    h(ZoomControls)
                )
            )
        ),
         (isLoading || error) && h('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
            isLoading ? h('div', { className: 'bg-white p-6 rounded-lg shadow-xl text-center' },
                h('div', { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4'}),
                h('p', { className: 'text-lg font-semibold' }, loadingMessage || 'Procesando...'),
                h('p', { className: 'text-sm text-slate-500' }, 'Por favor, espera un momento.')
            ) :
            error && h('div', { className: 'bg-white p-6 rounded-lg shadow-xl max-w-sm w-full' },
                h('h3', { className: 'text-xl font-bold text-red-600 mb-2' }, 'Ocurrió un Error'),
                h('p', { className: 'text-slate-700 mb-4' }, error),
                h('button', { 
                    onClick: () => setError(''),
                    className: 'w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600'
                }, 'Cerrar')
            )
        )
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));