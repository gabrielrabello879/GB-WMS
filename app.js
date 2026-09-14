/* =========================================================
   GB WMS
   Warehouse Management System
   app.js
========================================================= */


/* =========================================================
   BANCO LOCAL
========================================================= */

let products =
    JSON.parse(localStorage.getItem("gbwms_products")) || [];

let suppliers =
    JSON.parse(localStorage.getItem("gbwms_suppliers")) || [];

let movements =
    JSON.parse(localStorage.getItem("gbwms_movements")) || [];

let inventories =
    JSON.parse(localStorage.getItem("gbwms_inventories")) || [];


function saveProducts() {
    localStorage.setItem(
        "gbwms_products",
        JSON.stringify(products)
    );
}


function saveSuppliers() {
    localStorage.setItem(
        "gbwms_suppliers",
        JSON.stringify(suppliers)
    );
}


function saveMovements() {
    localStorage.setItem(
        "gbwms_movements",
        JSON.stringify(movements)
    );
}


function saveInventories() {
    localStorage.setItem(
        "gbwms_inventories",
        JSON.stringify(inventories)
    );
}


/* =========================================================
   ELEMENTOS GERAIS
========================================================= */

const menuItems =
    document.querySelectorAll(".menu-item");

const pageSections =
    document.querySelectorAll(".page-section");

const pageTitle =
    document.getElementById("pageTitle");

const pageDescription =
    document.getElementById("pageDescription");

const globalSearch =
    document.getElementById("globalSearch");


/* =========================================================
   NAVEGAÇÃO
========================================================= */

const pageConfiguration = {

    dashboard: {
        element: "dashboardPage",
        title: "Visão geral",
        description:
            "Acompanhe os principais indicadores da operação."
    },

    produtos: {
        element: "productsPage",
        title: "Produtos",
        description:
            "Gerencie SKUs, endereços e parâmetros de estoque."
    },

    estoque: {
        element: "stockPage",
        title: "Controle de estoque",
        description:
            "Execute recebimentos, expedições e ajustes."
    },

    movimentacoes: {
        element: "movementsPage",
        title: "Movimentações",
        description:
            "Consulte a rastreabilidade das operações."
    },

    transferencias: {
        element: "transfersPage",
        title: "Transferências",
        description:
            "Movimente mercadorias entre endereços sem alterar o estoque total."
    },

    inventario: {
        element: "inventoryPage",
        title: "Inventário de estoque",
        description:
            "Controle contagens físicas, divergências e aprovações."
    },

    fornecedores: {
        element: "suppliersPage",
        title: "Fornecedores",
        description:
            "Gerencie os parceiros vinculados aos recebimentos."
    },

    relatorios: {
        element: "reportsPage",
        title: "Relatórios",
        description:
            "Analise estoque, movimentações, inventários e indicadores operacionais."
    }

};


function navigateTo(page) {

    const config =
        pageConfiguration[page];

    if (!config) return;


    pageSections.forEach(section => {
        section.classList.remove("active");
    });


    menuItems.forEach(item => {
        item.classList.remove("active");
    });


    const targetPage =
        document.getElementById(config.element);

    if (targetPage) {
        targetPage.classList.add("active");
    }


    const targetMenu =
        document.querySelector(
            `.menu-item[data-page="${page}"]`
        );

    if (targetMenu) {
        targetMenu.classList.add("active");
    }


    pageTitle.textContent =
        config.title;

    pageDescription.textContent =
        config.description;


    if (page === "relatorios") {
        renderReports();
    }

    if (page === "dashboard") {
        renderMovementChart();
    }
}


menuItems.forEach(item => {

    item.addEventListener(
        "click",
        event => {

            event.preventDefault();

            navigateTo(
                item.dataset.page
            );
        }
    );

});


/* =========================================================
   DIÁLOGO PADRÃO
========================================================= */

const systemDialogModal =
    document.getElementById("systemDialogModal");

const systemDialogIcon =
    document.getElementById("systemDialogIcon");

const systemDialogEyebrow =
    document.getElementById("systemDialogEyebrow");

const systemDialogTitle =
    document.getElementById("systemDialogTitle");

const systemDialogMessage =
    document.getElementById("systemDialogMessage");

const systemDialogCancel =
    document.getElementById("systemDialogCancel");

const systemDialogConfirm =
    document.getElementById("systemDialogConfirm");

const closeSystemDialogButton =
    document.getElementById("closeSystemDialog");

let systemDialogAction = null;


function openSystemDialog({

    type = "warning",

    eyebrow = "GB WMS",

    title = "Atenção",

    message = "",

    confirmText = "Entendi",

    cancelText = "Cancelar",

    showCancel = false,

    onConfirm = null

}) {

    systemDialogAction =
        typeof onConfirm === "function"
            ? onConfirm
            : null;


    systemDialogEyebrow.textContent =
        eyebrow;

    systemDialogTitle.textContent =
        title;

    systemDialogMessage.textContent =
        message;

    systemDialogConfirm.textContent =
        confirmText;

    systemDialogCancel.textContent =
        cancelText;

    systemDialogCancel.style.display =
        showCancel ? "" : "none";


    if (type === "success") {

        systemDialogIcon.textContent = "✓";

    } else if (type === "error") {

        systemDialogIcon.textContent = "×";

    } else if (type === "question") {

        systemDialogIcon.textContent = "?";

    } else {

        systemDialogIcon.textContent = "!";

    }


    systemDialogModal.classList.add("show");
}


function closeSystemDialog() {

    systemDialogModal.classList.remove("show");

    systemDialogAction = null;
}


systemDialogConfirm?.addEventListener(
    "click",
    () => {

        const action =
            systemDialogAction;

        systemDialogModal.classList.remove("show");

        systemDialogAction = null;

        if (action) {
            action();
        }

    }
);


systemDialogCancel?.addEventListener(
    "click",
    closeSystemDialog
);


closeSystemDialogButton?.addEventListener(
    "click",
    closeSystemDialog
);


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();
}


function getStockStatus(product) {

    const stock =
        Number(product.stock || 0);

    const minimum =
        Number(product.minimum || 0);


    if (stock === 0) {

        return {
            label: "Sem estoque",
            className: "stock-zero"
        };

    }


    if (stock <= minimum) {

        return {
            label: "Crítico",
            className: "stock-critical"
        };

    }


    return {
        label: "Normal",
        className: "stock-normal"
    };
}


function formatDateTime(value) {

    if (!value) return "-";


    return new Date(value)
        .toLocaleString(
            "pt-BR",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );
}


function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function generateId() {

    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();
    }


    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );
}


function getMovementQuantityText(movement) {

    if (movement.type === "Entrada") {

        return `+${movement.quantity}`;
    }


    if (movement.type === "Saída") {

        return `-${movement.quantity}`;
    }


    if (
        movement.type === "Ajuste" ||
        movement.type === "Ajuste de Inventário"
    ) {

        const difference =
            Number(
                movement.adjustmentDifference ?? 0
            );

        return difference > 0
            ? `+${difference}`
            : `${difference}`;
    }


    return `${movement.quantity || 0}`;
}


function getMovementQuantityClass(movement) {

    if (movement.type === "Entrada") {
        return "stock-normal";
    }


    if (movement.type === "Saída") {
        return "stock-critical";
    }


    if (
        movement.type === "Ajuste" ||
        movement.type === "Ajuste de Inventário"
    ) {

        return Number(
            movement.adjustmentDifference || 0
        ) >= 0
            ? "stock-normal"
            : "stock-critical";
    }


    return "";
}


/* =========================================================
   PRODUTOS
========================================================= */

const productModal =
    document.getElementById("productModal");

const productForm =
    document.getElementById("productForm");

const newProductButton =
    document.getElementById("newProductButton");

const closeProductModalButton =
    document.getElementById("closeProductModal");

const cancelProductButton =
    document.getElementById("cancelProductButton");

const productSearch =
    document.getElementById("productSearch");

const productStatusFilter =
    document.getElementById("productStatusFilter");

const productsTableBody =
    document.getElementById("productsTableBody");


function openProductModal() {

    productForm.reset();

    document.getElementById(
        "productStatus"
    ).value = "Ativo";

    productModal.classList.add("show");
}


function closeProductModal() {

    productModal.classList.remove("show");
}


newProductButton?.addEventListener(
    "click",
    openProductModal
);


closeProductModalButton?.addEventListener(
    "click",
    closeProductModal
);


cancelProductButton?.addEventListener(
    "click",
    closeProductModal
);


productForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "productName"
            ).value.trim();

        const sku =
            document.getElementById(
                "productSku"
            ).value.trim().toUpperCase();

        const category =
            document.getElementById(
                "productCategory"
            ).value.trim();

        const unit =
            document.getElementById(
                "productUnit"
            ).value;

        const location =
            document.getElementById(
                "productLocation"
            ).value.trim().toUpperCase();

        const minimum =
            Number(
                document.getElementById(
                    "productMinimum"
                ).value
            );

        const status =
            document.getElementById(
                "productStatus"
            ).value;


        const duplicate =
            products.some(
                product =>
                    normalizeText(product.sku) ===
                    normalizeText(sku)
            );


        if (duplicate) {

            openSystemDialog({
                type: "warning",
                eyebrow: "CADASTRO DE PRODUTO",
                title: "SKU já cadastrado",
                message:
                    `O SKU ${sku} já pertence a outro produto.`
            });

            return;
        }


        products.unshift({

            id: generateId(),

            name,

            sku,

            category,

            unit,

            location,

            minimum,

            stock: 0,

            status,

            createdAt:
                new Date().toISOString()

        });


        saveProducts();

        closeProductModal();

        refreshSystem();


        openSystemDialog({
            type: "success",
            eyebrow: "CADASTRO DE PRODUTO",
            title: "Produto cadastrado",
            message:
                `${name} foi cadastrado com estoque inicial igual a zero.`
        });

    }
);


function renderProducts() {

    if (!productsTableBody) return;


    const search =
        normalizeText(
            productSearch?.value
        );

    const status =
        productStatusFilter?.value || "";


    const filtered =
        products.filter(product => {

            const content =
                normalizeText(
                    `${product.sku} ${product.name} ${product.category} ${product.location}`
                );


            const matchesSearch =
                content.includes(search);

            const matchesStatus =
                !status ||
                product.status === status;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


    productsTableBody.innerHTML =
        filtered.length
            ? filtered.map(product => {

                const stockStatus =
                    getStockStatus(product);

                return `

                    <tr>

                        <td>
                            <strong>
                                ${product.sku}
                            </strong>
                        </td>

                        <td>
                            ${product.name}
                        </td>

                        <td>
                            ${product.category || "-"}
                        </td>

                        <td>
                            ${product.location || "-"}
                        </td>

                        <td>
                            ${Number(product.stock || 0)}
                            ${product.unit || ""}
                        </td>

                        <td>
                            ${Number(product.minimum || 0)}
                        </td>

                        <td>
                            ${product.status}
                            •
                            ${stockStatus.label}
                        </td>

                        <td>

                            <button
                                class="secondary-button"
                                onclick="toggleProductStatus('${product.id}')"
                            >
                                ${product.status === "Ativo"
                        ? "Inativar"
                        : "Ativar"
                    }
                            </button>

                            <button
                                class="secondary-button"
                                onclick="deleteProduct('${product.id}')"
                            >
                                Excluir
                            </button>

                        </td>

                    </tr>

                `;

            }).join("")
            : `

                <tr>

                    <td colspan="8">
                        Nenhum produto encontrado.
                    </td>

                </tr>

            `;


    document.getElementById(
        "productTotalCount"
    ).textContent =
        products.length;


    document.getElementById(
        "productActiveCount"
    ).textContent =
        products.filter(
            product =>
                product.status === "Ativo"
        ).length;


    document.getElementById(
        "productCriticalCount"
    ).textContent =
        products.filter(
            product =>
                product.status === "Ativo" &&
                Number(product.stock || 0) <=
                Number(product.minimum || 0)
        ).length;
}


function toggleProductStatus(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product) return;


    product.status =
        product.status === "Ativo"
            ? "Inativo"
            : "Ativo";


    saveProducts();

    refreshSystem();
}


function deleteProduct(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product) return;


    if (Number(product.stock || 0) > 0) {

        openSystemDialog({
            type: "warning",
            eyebrow: "CADASTRO DE PRODUTO",
            title: "Exclusão bloqueada",
            message:
                "Produtos com saldo em estoque não podem ser excluídos. Inative o cadastro."
        });

        return;
    }


    const hasMovement =
        movements.some(
            movement =>
                movement.productId === id
        );


    const hasInventory =
        inventories.some(
            inventory =>
                inventory.productId === id
        );


    if (
        hasMovement ||
        hasInventory
    ) {

        openSystemDialog({
            type: "warning",
            eyebrow: "RASTREABILIDADE",
            title: "Exclusão bloqueada",
            message:
                "Esse produto possui histórico operacional. Para preservar a rastreabilidade, inative o cadastro."
        });

        return;
    }


    openSystemDialog({

        type: "question",

        eyebrow: "CADASTRO DE PRODUTO",

        title: "Excluir produto?",

        message:
            `O produto ${product.name} será removido permanentemente.`,

        confirmText: "Excluir",

        cancelText: "Cancelar",

        showCancel: true,

        onConfirm: () => {

            products =
                products.filter(
                    item =>
                        item.id !== id
                );

            saveProducts();

            refreshSystem();

        }

    });
}


productSearch?.addEventListener(
    "input",
    renderProducts
);


productStatusFilter?.addEventListener(
    "change",
    renderProducts
);


/* =========================================================
   FORNECEDORES
========================================================= */

const supplierModal =
    document.getElementById("supplierModal");

const supplierForm =
    document.getElementById("supplierForm");

const newSupplierButton =
    document.getElementById("newSupplierButton");

const closeSupplierModalButton =
    document.getElementById("closeSupplierModal");

const cancelSupplierButton =
    document.getElementById("cancelSupplierButton");

const supplierSearch =
    document.getElementById("supplierSearch");

const supplierStatusFilter =
    document.getElementById("supplierStatusFilter");

const suppliersTableBody =
    document.getElementById("suppliersTableBody");


function formatCnpj(value) {

    const numbers =
        value.replace(/\D/g, "")
            .slice(0, 14);
    function formatCnpj(value) {

        const numbers =
            value.replace(/\D/g, "")
                .slice(0, 14);


        return numbers
            .replace(
                /^(\d{2})(\d)/,
                "$1.$2"
            )
            .replace(
                /^(\d{2})\.(\d{3})(\d)/,
                "$1.$2.$3"
            )
            .replace(
                /\.(\d{3})(\d)/,
                ".$1/$2"
            )
            .replace(
                /(\d{4})(\d)/,
                "$1-$2"
            );
    }


    document.getElementById(
        "supplierCnpj"
    )?.addEventListener(
        "input",
        event => {

            event.target.value =
                formatCnpj(
                    event.target.value
                );
        }
    );


    function openSupplierModal() {

        supplierForm.reset();

        document.getElementById(
            "supplierStatus"
        ).value = "Ativo";

        supplierModal.classList.add("show");
    }


    function closeSupplierModal() {

        supplierModal.classList.remove("show");
    }


    newSupplierButton?.addEventListener(
        "click",
        openSupplierModal
    );


    closeSupplierModalButton?.addEventListener(
        "click",
        closeSupplierModal
    );


    cancelSupplierButton?.addEventListener(
        "click",
        closeSupplierModal
    );


    supplierForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const cnpj =
                document.getElementById(
                    "supplierCnpj"
                ).value.trim();

            const tradeName =
                document.getElementById(
                    "supplierTradeName"
                ).value.trim();

            const corporateName =
                document.getElementById(
                    "supplierCorporateName"
                ).value.trim();

            const contact =
                document.getElementById(
                    "supplierContact"
                ).value.trim();

            const phone =
                document.getElementById(
                    "supplierPhone"
                ).value.trim();

            const email =
                document.getElementById(
                    "supplierEmail"
                ).value.trim();

            const status =
                document.getElementById(
                    "supplierStatus"
                ).value;


            const normalizedCnpj =
                cnpj.replace(/\D/g, "");


            const duplicate =
                suppliers.some(
                    supplier =>
                        String(
                            supplier.cnpj || ""
                        ).replace(/\D/g, "") ===
                        normalizedCnpj
                );


            if (duplicate) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "FORNECEDORES",
                    title: "CNPJ já cadastrado",
                    message:
                        "Já existe um fornecedor utilizando esse CNPJ."
                });

                return;
            }


            suppliers.unshift({

                id: generateId(),

                cnpj,

                tradeName,

                corporateName,

                contact,

                phone,

                email,

                status,

                createdAt:
                    new Date().toISOString()

            });


            saveSuppliers();

            closeSupplierModal();

            refreshSystem();


            openSystemDialog({
                type: "success",
                eyebrow: "FORNECEDORES",
                title: "Fornecedor cadastrado",
                message:
                    `${tradeName} foi incluído no cadastro de fornecedores.`
            });

        }
    );


    function renderSuppliers() {

        if (!suppliersTableBody) return;


        const search =
            normalizeText(
                supplierSearch?.value
            );

        const status =
            supplierStatusFilter?.value || "";


        const filtered =
            suppliers.filter(supplier => {

                const content =
                    normalizeText(
                        `${supplier.cnpj} ${supplier.tradeName} ${supplier.corporateName} ${supplier.contact}`
                    );


                return (
                    content.includes(search) &&
                    (
                        !status ||
                        supplier.status === status
                    )
                );

            });


        suppliersTableBody.innerHTML =
            filtered.length
                ? filtered.map(supplier => `

                <tr>

                    <td>
                        ${supplier.cnpj}
                    </td>

                    <td>
                        <strong>
                            ${supplier.tradeName}
                        </strong>
                    </td>

                    <td>
                        ${supplier.corporateName || "-"}
                    </td>

                    <td>
                        ${supplier.contact || "-"}
                    </td>

                    <td>
                        ${supplier.phone || "-"}
                    </td>

                    <td>
                        ${supplier.status}
                    </td>

                    <td>

                        <button
                            class="secondary-button"
                            onclick="toggleSupplierStatus('${supplier.id}')"
                        >
                            ${supplier.status === "Ativo"
                        ? "Inativar"
                        : "Ativar"
                    }
                        </button>

                        <button
                            class="secondary-button"
                            onclick="deleteSupplier('${supplier.id}')"
                        >
                            Excluir
                        </button>

                    </td>

                </tr>

            `).join("")
                : `

                <tr>
                    <td colspan="7">
                        Nenhum fornecedor encontrado.
                    </td>
                </tr>

            `;
    }


    function toggleSupplierStatus(id) {

        const supplier =
            suppliers.find(
                supplier =>
                    supplier.id === id
            );

        if (!supplier) return;


        supplier.status =
            supplier.status === "Ativo"
                ? "Inativo"
                : "Ativo";


        saveSuppliers();

        refreshSystem();
    }


    function deleteSupplier(id) {

        const supplier =
            suppliers.find(
                supplier =>
                    supplier.id === id
            );

        if (!supplier) return;


        const hasHistory =
            movements.some(
                movement =>
                    movement.supplierId === id
            );


        if (hasHistory) {

            openSystemDialog({
                type: "warning",
                eyebrow: "RASTREABILIDADE",
                title: "Exclusão bloqueada",
                message:
                    "Esse fornecedor possui recebimentos registrados. Inative o cadastro para preservar o histórico."
            });

            return;
        }


        openSystemDialog({

            type: "question",

            eyebrow: "FORNECEDORES",

            title: "Excluir fornecedor?",

            message:
                `${supplier.tradeName} será removido permanentemente.`,

            confirmText: "Excluir",

            showCancel: true,

            onConfirm: () => {

                suppliers =
                    suppliers.filter(
                        item =>
                            item.id !== id
                    );

                saveSuppliers();

                refreshSystem();

            }

        });
    }


    supplierSearch?.addEventListener(
        "input",
        renderSuppliers
    );


    supplierStatusFilter?.addEventListener(
        "change",
        renderSuppliers
    );


    /* =========================================================
       ENTRADA
    ========================================================= */

    const entryModal =
        document.getElementById("entryModal");

    const entryForm =
        document.getElementById("entryForm");

    const newEntryButton =
        document.getElementById("newEntryButton");

    const closeEntryModalButton =
        document.getElementById("closeEntryModal");

    const cancelEntryButton =
        document.getElementById("cancelEntryButton");

    const entryProduct =
        document.getElementById("entryProduct");

    const entrySupplier =
        document.getElementById("entrySupplier");

    const entryQuantity =
        document.getElementById("entryQuantity");


    function populateEntryOptions() {

        const activeProducts =
            products.filter(
                product =>
                    product.status === "Ativo"
            );

        const activeSuppliers =
            suppliers.filter(
                supplier =>
                    supplier.status === "Ativo"
            );


        entryProduct.innerHTML =
            `<option value="">Selecione</option>` +
            activeProducts.map(product => `

            <option value="${product.id}">
                ${product.sku} - ${product.name}
            </option>

        `).join("");


        entrySupplier.innerHTML =
            `<option value="">Selecione</option>` +
            activeSuppliers.map(supplier => `

            <option value="${supplier.id}">
                ${supplier.tradeName} - ${supplier.cnpj}
            </option>

        `).join("");
    }


    function updateEntryPreview() {

        const product =
            products.find(
                item =>
                    item.id === entryProduct.value
            );


        const quantity =
            Number(
                entryQuantity.value || 0
            );


        const stock =
            Number(
                product?.stock || 0
            );


        document.getElementById(
            "entryPreviewSku"
        ).textContent =
            product?.sku || "-";

        document.getElementById(
            "entryPreviewLocation"
        ).textContent =
            product?.location || "-";

        document.getElementById(
            "entryPreviewStock"
        ).textContent =
            stock;

        document.getElementById(
            "entryPreviewMinimum"
        ).textContent =
            product?.minimum || 0;

        document.getElementById(
            "entryCurrentStock"
        ).textContent =
            stock;

        document.getElementById(
            "entryQuantityPreview"
        ).textContent =
            quantity;

        document.getElementById(
            "entryProjectedStock"
        ).textContent =
            stock + quantity;
    }


    function openEntryModal() {

        const activeProducts =
            products.filter(
                product =>
                    product.status === "Ativo"
            );


        if (!activeProducts.length) {

            openSystemDialog({
                type: "warning",
                eyebrow: "RECEBIMENTO",
                title: "Nenhum produto ativo",
                message:
                    "Cadastre ou ative um produto antes de registrar uma entrada."
            });

            return;
        }


        const activeSuppliers =
            suppliers.filter(
                supplier =>
                    supplier.status === "Ativo"
            );


        if (!activeSuppliers.length) {

            openSystemDialog({
                type: "warning",
                eyebrow: "RECEBIMENTO",
                title: "Nenhum fornecedor ativo",
                message:
                    "Cadastre ou ative um fornecedor antes de registrar uma entrada."
            });

            return;
        }


        entryForm.reset();

        populateEntryOptions();

        updateEntryPreview();

        entryModal.classList.add("show");
    }


    function closeEntryModal() {

        entryModal.classList.remove("show");
    }


    newEntryButton?.addEventListener(
        "click",
        openEntryModal
    );


    closeEntryModalButton?.addEventListener(
        "click",
        closeEntryModal
    );


    cancelEntryButton?.addEventListener(
        "click",
        closeEntryModal
    );


    entryProduct?.addEventListener(
        "change",
        updateEntryPreview
    );


    entryQuantity?.addEventListener(
        "input",
        updateEntryPreview
    );


    entryForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const supplier =
                suppliers.find(
                    supplier =>
                        supplier.id ===
                        entrySupplier.value
                );

            const product =
                products.find(
                    product =>
                        product.id ===
                        entryProduct.value
                );

            const quantity =
                Number(
                    entryQuantity.value
                );

            const documentNumber =
                document.getElementById(
                    "entryDocument"
                ).value.trim();

            const notes =
                document.getElementById(
                    "entryNotes"
                ).value.trim();


            if (!supplier) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "RECEBIMENTO",
                    title: "Fornecedor inválido",
                    message:
                        "Selecione um fornecedor ativo."
                });

                return;
            }


            if (!product) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "RECEBIMENTO",
                    title: "Produto inválido",
                    message:
                        "Selecione um produto válido."
                });

                return;
            }


            if (
                !Number.isFinite(quantity) ||
                quantity <= 0
            ) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "RECEBIMENTO",
                    title: "Quantidade inválida",
                    message:
                        "Informe uma quantidade maior que zero."
                });

                return;
            }


            const previousStock =
                Number(product.stock || 0);

            const newStock =
                previousStock + quantity;


            product.stock =
                newStock;


            movements.unshift({

                id: generateId(),

                type: "Entrada",

                supplierId:
                    supplier.id,

                supplierName:
                    supplier.tradeName,

                supplierCnpj:
                    supplier.cnpj,

                productId:
                    product.id,

                sku:
                    product.sku,

                productName:
                    product.name,

                quantity,

                previousStock,

                newStock,

                unit:
                    product.unit,

                location:
                    product.location,

                document:
                    documentNumber,

                reason: "-",

                notes:
                    notes || "-",

                responsible:
                    "Gabriel",

                createdAt:
                    new Date().toISOString()

            });


            saveProducts();

            saveMovements();

            closeEntryModal();

            refreshSystem();


            openEntrySuccess(
                product,
                quantity,
                previousStock,
                newStock
            );

        }
    );


    /* =========================================================
       SUCESSO ENTRADA
    ========================================================= */

    const entrySuccessModal =
        document.getElementById(
            "entrySuccessModal"
        );


    function openEntrySuccess(
        product,
        quantity,
        previousStock,
        newStock
    ) {

        document.getElementById(
            "entrySuccessMessage"
        ).textContent =
            `${quantity} ${product.unit} de ${product.name} recebidas. Saldo: ${previousStock} → ${newStock}.`;


        entrySuccessModal.classList.add("show");
    }


    function closeEntrySuccess() {

        entrySuccessModal.classList.remove("show");
    }


    document.getElementById(
        "closeEntrySuccessModal"
    )?.addEventListener(
        "click",
        closeEntrySuccess
    );


    document.getElementById(
        "finishEntrySuccess"
    )?.addEventListener(
        "click",
        closeEntrySuccess
    );


    /* =========================================================
       SAÍDA
    ========================================================= */

    const exitModal =
        document.getElementById("exitModal");

    const exitForm =
        document.getElementById("exitForm");

    const newExitButton =
        document.getElementById("newExitButton");

    const exitProduct =
        document.getElementById("exitProduct");

    const exitQuantity =
        document.getElementById("exitQuantity");


    function populateExitProducts() {

        const available =
            products.filter(
                product =>
                    product.status === "Ativo" &&
                    Number(product.stock || 0) > 0
            );


        exitProduct.innerHTML =
            `<option value="">Selecione</option>` +
            available.map(product => `

            <option value="${product.id}">
                ${product.sku} - ${product.name}
            </option>

        `).join("");
    }


    function updateExitPreview() {

        const product =
            products.find(
                product =>
                    product.id ===
                    exitProduct.value
            );


        const stock =
            Number(
                product?.stock || 0
            );

        const quantity =
            Number(
                exitQuantity.value || 0
            );


        document.getElementById(
            "exitPreviewSku"
        ).textContent =
            product?.sku || "-";

        document.getElementById(
            "exitPreviewLocation"
        ).textContent =
            product?.location || "-";

        document.getElementById(
            "exitPreviewStock"
        ).textContent =
            stock;

        document.getElementById(
            "exitPreviewMinimum"
        ).textContent =
            product?.minimum || 0;

        document.getElementById(
            "exitCurrentStock"
        ).textContent =
            stock;

        document.getElementById(
            "exitQuantityPreview"
        ).textContent =
            quantity;

        document.getElementById(
            "exitProjectedStock"
        ).textContent =
            stock - quantity;
    }


    function openExitModal() {

        const available =
            products.filter(
                product =>
                    product.status === "Ativo" &&
                    Number(product.stock || 0) > 0
            );


        if (!available.length) {

            openSystemDialog({
                type: "warning",
                eyebrow: "EXPEDIÇÃO",
                title: "Sem estoque disponível",
                message:
                    "Nenhum produto possui saldo disponível para expedição."
            });

            return;
        }


        exitForm.reset();

        populateExitProducts();

        updateExitPreview();

        exitModal.classList.add("show");
    }


    function closeExitModal() {

        exitModal.classList.remove("show");
    }


    newExitButton?.addEventListener(
        "click",
        openExitModal
    );


    document.getElementById(
        "closeExitModal"
    )?.addEventListener(
        "click",
        closeExitModal
    );


    document.getElementById(
        "cancelExitButton"
    )?.addEventListener(
        "click",
        closeExitModal
    );


    exitProduct?.addEventListener(
        "change",
        updateExitPreview
    );


    exitQuantity?.addEventListener(
        "input",
        updateExitPreview
    );


    exitForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const product =
                products.find(
                    product =>
                        product.id ===
                        exitProduct.value
                );


            const quantity =
                Number(
                    exitQuantity.value
                );


            if (!product) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "EXPEDIÇÃO",
                    title: "Produto inválido",
                    message:
                        "Selecione um produto válido."
                });

                return;
            }


            if (
                !Number.isFinite(quantity) ||
                quantity <= 0
            ) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "EXPEDIÇÃO",
                    title: "Quantidade inválida",
                    message:
                        "Informe uma quantidade maior que zero."
                });

                return;
            }


            const previousStock =
                Number(product.stock || 0);


            if (quantity > previousStock) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "EXPEDIÇÃO",
                    title: "Saldo insuficiente",
                    message:
                        `Existem apenas ${previousStock} ${product.unit} disponíveis.`
                });

                return;
            }


            const newStock =
                previousStock - quantity;


            product.stock =
                newStock;


            movements.unshift({

                id: generateId(),

                type: "Saída",

                supplierId: null,

                supplierName: "-",

                supplierCnpj: "-",

                productId:
                    product.id,

                sku:
                    product.sku,

                productName:
                    product.name,

                quantity,

                previousStock,

                newStock,

                unit:
                    product.unit,

                location:
                    product.location,

                document:
                    document.getElementById(
                        "exitDocument"
                    ).value.trim(),

                reason: "-",

                notes:
                    document.getElementById(
                        "exitNotes"
                    ).value.trim() || "-",

                responsible:
                    "Gabriel",

                createdAt:
                    new Date().toISOString()

            });


            saveProducts();

            saveMovements();

            closeExitModal();

            refreshSystem();


            document.getElementById(
                "exitSuccessMessage"
            ).textContent =
                `${quantity} ${product.unit} de ${product.name} expedidas. Saldo: ${previousStock} → ${newStock}.`;


            document.getElementById(
                "exitSuccessModal"
            ).classList.add("show");

        }
    );


    function closeExitSuccess() {

        document.getElementById(
            "exitSuccessModal"
        ).classList.remove("show");
    }


    document.getElementById(
        "closeExitSuccessModal"
    )?.addEventListener(
        "click",
        closeExitSuccess
    );


    document.getElementById(
        "finishExitSuccess"
    )?.addEventListener(
        "click",
        closeExitSuccess
    );


    /* =========================================================
       AJUSTE
    ========================================================= */

    const adjustmentModal =
        document.getElementById(
            "adjustmentModal"
        );

    const adjustmentForm =
        document.getElementById(
            "adjustmentForm"
        );

    const adjustmentProduct =
        document.getElementById(
            "adjustmentProduct"
        );

    const adjustmentPhysicalStock =
        document.getElementById(
            "adjustmentPhysicalStock"
        );


    function populateAdjustmentProducts() {

        const active =
            products.filter(
                product =>
                    product.status === "Ativo"
            );


        adjustmentProduct.innerHTML =
            `<option value="">Selecione</option>` +
            active.map(product => `

            <option value="${product.id}">
                ${product.sku} - ${product.name}
            </option>

        `).join("");
    }


    function updateAdjustmentPreview() {

        const product =
            products.find(
                product =>
                    product.id ===
                    adjustmentProduct.value
            );


        const systemStock =
            Number(
                product?.stock || 0
            );


        const physicalValue =
            adjustmentPhysicalStock.value;


        const physicalStock =
            physicalValue === ""
                ? 0
                : Number(physicalValue);


        const difference =
            physicalValue === ""
                ? 0
                : physicalStock - systemStock;


        document.getElementById(
            "adjustmentPreviewSku"
        ).textContent =
            product?.sku || "-";

        document.getElementById(
            "adjustmentPreviewLocation"
        ).textContent =
            product?.location || "-";

        document.getElementById(
            "adjustmentSystemStock"
        ).textContent =
            systemStock;

        document.getElementById(
            "adjustmentCurrentStock"
        ).textContent =
            systemStock;

        document.getElementById(
            "adjustmentPreviewUnit"
        ).textContent =
            product?.unit || "-";

        document.getElementById(
            "adjustmentPhysicalPreview"
        ).textContent =
            physicalValue === ""
                ? 0
                : physicalStock;

        document.getElementById(
            "adjustmentDifference"
        ).textContent =
            difference > 0
                ? `+${difference}`
                : difference;
    }


    function openAdjustmentModal() {

        const active =
            products.filter(
                product =>
                    product.status === "Ativo"
            );


        if (!active.length) {

            openSystemDialog({
                type: "warning",
                eyebrow: "AJUSTE",
                title: "Nenhum produto ativo",
                message:
                    "Não existem produtos ativos para ajuste."
            });

            return;
        }


        adjustmentForm.reset();

        populateAdjustmentProducts();

        updateAdjustmentPreview();

        adjustmentModal.classList.add("show");
    }


    function closeAdjustmentModal() {

        adjustmentModal.classList.remove("show");
    }


    document.getElementById(
        "newAdjustmentButton"
    )?.addEventListener(
        "click",
        openAdjustmentModal
    );


    document.getElementById(
        "closeAdjustmentModal"
    )?.addEventListener(
        "click",
        closeAdjustmentModal
    );


    document.getElementById(
        "cancelAdjustmentButton"
    )?.addEventListener(
        "click",
        closeAdjustmentModal
    );


    adjustmentProduct?.addEventListener(
        "change",
        updateAdjustmentPreview
    );


    adjustmentPhysicalStock?.addEventListener(
        "input",
        updateAdjustmentPreview
    );


    adjustmentForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const product =
                products.find(
                    product =>
                        product.id ===
                        adjustmentProduct.value
                );


            if (!product) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "AJUSTE",
                    title: "Produto inválido",
                    message:
                        "Selecione um produto válido."
                });

                return;
            }


            const physicalValue =
                adjustmentPhysicalStock.value;


            if (physicalValue === "") {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "AJUSTE",
                    title: "Quantidade necessária",
                    message:
                        "Informe a quantidade física encontrada."
                });

                return;
            }


            const physicalStock =
                Number(physicalValue);


            if (
                !Number.isFinite(physicalStock) ||
                physicalStock < 0
            ) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "AJUSTE",
                    title: "Quantidade inválida",
                    message:
                        "A quantidade física não pode ser negativa."
                });

                return;
            }


            const reason =
                document.getElementById(
                    "adjustmentReason"
                ).value;


            if (!reason) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "AJUSTE",
                    title: "Motivo obrigatório",
                    message:
                        "Informe o motivo do ajuste."
                });

                return;
            }


            const previousStock =
                Number(product.stock || 0);

            const difference =
                physicalStock -
                previousStock;


            if (difference === 0) {

                closeAdjustmentModal();

                openNoDifferenceModal(
                    product,
                    previousStock,
                    physicalStock
                );

                return;
            }


            product.stock =
                physicalStock;


            movements.unshift({

                id: generateId(),

                type: "Ajuste",

                supplierId: null,

                supplierName: "-",

                supplierCnpj: "-",

                productId:
                    product.id,

                sku:
                    product.sku,

                productName:
                    product.name,

                quantity:
                    Math.abs(difference),

                adjustmentDifference:
                    difference,

                adjustmentDirection:
                    difference > 0
                        ? "Positivo"
                        : "Negativo",

                previousStock,

                physicalStock,

                newStock:
                    physicalStock,

                unit:
                    product.unit,

                location:
                    product.location,

                document: "-",

                reason,

                notes:
                    document.getElementById(
                        "adjustmentNotes"
                    ).value.trim() || "-",

                responsible:
                    "Gabriel",

                createdAt:
                    new Date().toISOString()

            });


            saveProducts();

            saveMovements();

            closeAdjustmentModal();

            refreshSystem();


            document.getElementById(
                "adjustmentSuccessMessage"
            ).textContent =
                `${product.name}: ${previousStock} → ${physicalStock} ${product.unit}. Divergência ${difference > 0 ? "+" : ""}${difference}.`;


            document.getElementById(
                "adjustmentSuccessModal"
            ).classList.add("show");

        }
    );


    function closeAdjustmentSuccess() {

        document.getElementById(
            "adjustmentSuccessModal"
        ).classList.remove("show");
    }


    document.getElementById(
        "closeAdjustmentSuccessModal"
    )?.addEventListener(
        "click",
        closeAdjustmentSuccess
    );


    document.getElementById(
        "finishAdjustmentSuccess"
    )?.addEventListener(
        "click",
        closeAdjustmentSuccess
    );


    /* =========================================================
       SEM DIVERGÊNCIA
    ========================================================= */

    function openNoDifferenceModal(
        product,
        systemStock,
        physicalStock
    ) {

        document.getElementById(
            "noDifferenceMessage"
        ).textContent =
            `${product.name} foi conferido sem divergência.`;


        document.getElementById(
            "noDifferenceDetails"
        ).innerHTML = `

        <div>
            <span>Saldo sistema</span>
            <strong>
                ${systemStock} ${product.unit}
            </strong>
        </div>

        <div>
            <span>Contagem física</span>
            <strong>
                ${physicalStock} ${product.unit}
            </strong>
        </div>

        <div>
            <span>Divergência</span>
            <strong>0</strong>
        </div>

    `;


        document.getElementById(
            "noDifferenceModal"
        ).classList.add("show");
    }


    function closeNoDifferenceModal() {

        document.getElementById(
            "noDifferenceModal"
        ).classList.remove("show");
    }


    document.getElementById(
        "closeNoDifferenceModal"
    )?.addEventListener(
        "click",
        closeNoDifferenceModal
    );


    document.getElementById(
        "finishNoDifference"
    )?.addEventListener(
        "click",
        closeNoDifferenceModal
    );


    /* =========================================================
       INVENTÁRIO
    ========================================================= */

    const inventoryModal =
        document.getElementById(
            "inventoryModal"
        );

    const inventoryForm =
        document.getElementById(
            "inventoryForm"
        );

    const inventoryProduct =
        document.getElementById(
            "inventoryProduct"
        );

    const inventoryPhysicalStock =
        document.getElementById(
            "inventoryPhysicalStock"
        );

    const inventorySearch =
        document.getElementById(
            "inventorySearch"
        );

    const inventoryStatusFilter =
        document.getElementById(
            "inventoryStatusFilter"
        );

    const inventoryTableBody =
        document.getElementById(
            "inventoryTableBody"
        );


    function generateInventoryCode() {

        let highest = 0;


        inventories.forEach(inventory => {

            const match =
                String(
                    inventory.code || ""
                ).match(
                    /INV-(\d+)/
                );


            if (match) {

                highest =
                    Math.max(
                        highest,
                        Number(match[1])
                    );
            }

        });


        return (
            "INV-" +
            String(
                highest + 1
            ).padStart(6, "0")
        );
    }


    function populateInventoryProducts() {

        const active =
            products.filter(
                product =>
                    product.status === "Ativo"
            );


        inventoryProduct.innerHTML =
            `<option value="">Selecione</option>` +
            active.map(product => `

            <option value="${product.id}">
                ${product.sku} - ${product.name}
            </option>

        `).join("");
    }


    function updateInventoryPreview() {

        const product =
            products.find(
                product =>
                    product.id ===
                    inventoryProduct.value
            );


        const systemStock =
            Number(
                product?.stock || 0
            );


        const physicalValue =
            inventoryPhysicalStock.value;


        const physicalStock =
            physicalValue === ""
                ? 0
                : Number(physicalValue);


        const difference =
            physicalValue === ""
                ? 0
                : physicalStock -
                systemStock;


        document.getElementById(
            "inventoryPreviewSku"
        ).textContent =
            product?.sku || "-";

        document.getElementById(
            "inventoryPreviewLocation"
        ).textContent =
            product?.location || "-";

        document.getElementById(
            "inventoryPreviewSystemStock"
        ).textContent =
            systemStock;

        document.getElementById(
            "inventoryPreviewUnit"
        ).textContent =
            product?.unit || "-";

        document.getElementById(
            "inventorySystemStock"
        ).textContent =
            systemStock;

        document.getElementById(
            "inventoryPhysicalPreview"
        ).textContent =
            physicalValue === ""
                ? 0
                : physicalStock;

        document.getElementById(
            "inventoryDifference"
        ).textContent =
            difference > 0
                ? `+${difference}`
                : difference;
    }
    function openInventoryModal() {

        const active =
            products.filter(
                product =>
                    product.status === "Ativo"
            );


        if (!active.length) {

            openSystemDialog({
                type: "warning",
                eyebrow: "INVENTÁRIO",
                title: "Nenhum produto ativo",
                message:
                    "Cadastre ou ative um produto antes de iniciar um inventário."
            });

            return;
        }


        inventoryForm.reset();

        populateInventoryProducts();


        document.getElementById(
            "inventoryPreviewCode"
        ).textContent =
            generateInventoryCode();


        updateInventoryPreview();

        inventoryModal.classList.add("show");
    }


    function closeInventoryModal() {

        inventoryModal.classList.remove("show");
    }


    document.getElementById(
        "newInventoryButton"
    )?.addEventListener(
        "click",
        openInventoryModal
    );


    document.getElementById(
        "closeInventoryModal"
    )?.addEventListener(
        "click",
        closeInventoryModal
    );


    document.getElementById(
        "cancelInventoryButton"
    )?.addEventListener(
        "click",
        closeInventoryModal
    );


    inventoryProduct?.addEventListener(
        "change",
        updateInventoryPreview
    );


    inventoryPhysicalStock?.addEventListener(
        "input",
        updateInventoryPreview
    );


    inventoryForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const product =
                products.find(
                    product =>
                        product.id ===
                        inventoryProduct.value
                );


            if (!product) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "INVENTÁRIO",
                    title: "Produto inválido",
                    message:
                        "Selecione um produto válido."
                });

                return;
            }


            const existingOpen =
                inventories.some(
                    inventory =>
                        inventory.productId ===
                        product.id &&
                        inventory.status ===
                        "Em conferência"
                );


            if (existingOpen) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "INVENTÁRIO",
                    title: "Contagem já aberta",
                    message:
                        "Esse produto já possui um inventário em conferência."
                });

                return;
            }


            const physicalValue =
                inventoryPhysicalStock.value;


            if (physicalValue === "") {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "INVENTÁRIO",
                    title: "Contagem necessária",
                    message:
                        "Informe a quantidade física contada."
                });

                return;
            }


            const physicalStock =
                Number(physicalValue);


            if (
                !Number.isFinite(physicalStock) ||
                physicalStock < 0
            ) {

                openSystemDialog({
                    type: "warning",
                    eyebrow: "INVENTÁRIO",
                    title: "Contagem inválida",
                    message:
                        "A quantidade física não pode ser negativa."
                });

                return;
            }


            const systemStock =
                Number(
                    product.stock || 0
                );

            const difference =
                physicalStock -
                systemStock;


            const inventory = {

                id: generateId(),

                code:
                    generateInventoryCode(),

                productId:
                    product.id,

                sku:
                    product.sku,

                productName:
                    product.name,

                category:
                    product.category,

                location:
                    product.location,

                unit:
                    product.unit,

                systemStock,

                physicalStock,

                difference,

                notes:
                    document.getElementById(
                        "inventoryNotes"
                    ).value.trim() || "-",

                status:
                    "Em conferência",

                responsible:
                    "Gabriel",

                approvedBy:
                    null,

                createdAt:
                    new Date().toISOString(),

                completedAt:
                    null,

                cancelledAt:
                    null

            };


            inventories.unshift(
                inventory
            );


            saveInventories();

            closeInventoryModal();

            refreshSystem();


            openSystemDialog({
                type: "success",
                eyebrow: "INVENTÁRIO",
                title: "Contagem registrada",
                message:
                    `${inventory.code} registrado. Divergência: ${difference > 0 ? "+" : ""}${difference}. O estoque ainda não foi alterado.`
            });

        }
    );


    function renderInventories() {

        if (!inventoryTableBody) return;


        const search =
            normalizeText(
                inventorySearch?.value
            );

        const status =
            inventoryStatusFilter?.value || "";


        const filtered =
            inventories.filter(
                inventory => {

                    const content =
                        normalizeText(
                            `${inventory.code} ${inventory.sku} ${inventory.productName} ${inventory.location}`
                        );


                    return (
                        content.includes(search) &&
                        (
                            !status ||
                            inventory.status ===
                            status
                        )
                    );
                }
            );


        inventoryTableBody.innerHTML =
            filtered.length
                ? filtered.map(inventory => {

                    const difference =
                        Number(
                            inventory.difference || 0
                        );


                    return `

                    <tr>

                        <td>
                            <strong>
                                ${inventory.code}
                            </strong>
                        </td>

                        <td>
                            ${inventory.sku}
                        </td>

                        <td>
                            ${inventory.productName}
                        </td>

                        <td>
                            ${inventory.location || "-"}
                        </td>

                        <td>
                            ${inventory.systemStock}
                        </td>

                        <td>
                            ${inventory.physicalStock}
                        </td>

                        <td>
                            <strong>
                                ${difference > 0
                            ? "+"
                            : ""
                        }${difference}
                            </strong>
                        </td>

                        <td>
                            ${inventory.status}
                        </td>

                        <td>
                            ${inventory.responsible}
                        </td>

                        <td>

                            ${inventory.status ===
                            "Em conferência"

                            ? `

                                    <button
                                        class="primary-button"
                                        onclick="approveInventory('${inventory.id}')"
                                    >
                                        Aprovar
                                    </button>

                                    <button
                                        class="secondary-button"
                                        onclick="cancelInventory('${inventory.id}')"
                                    >
                                        Cancelar
                                    </button>

                                `

                            : "-"
                        }

                        </td>

                    </tr>

                `;

                }).join("")
                : `

                <tr>

                    <td colspan="10">
                        Nenhum inventário encontrado.
                    </td>

                </tr>

            `;


        document.getElementById(
            "inventoryTotalCount"
        ).textContent =
            inventories.length;


        document.getElementById(
            "inventoryOpenCount"
        ).textContent =
            inventories.filter(
                inventory =>
                    inventory.status ===
                    "Em conferência"
            ).length;


        document.getElementById(
            "inventoryCompletedCount"
        ).textContent =
            inventories.filter(
                inventory =>
                    inventory.status ===
                    "Concluído"
            ).length;


        document.getElementById(
            "inventoryDivergenceCount"
        ).textContent =
            inventories.filter(
                inventory =>
                    Number(
                        inventory.difference || 0
                    ) !== 0
            ).length;
    }


    function approveInventory(id) {

        const inventory =
            inventories.find(
                inventory =>
                    inventory.id === id
            );


        if (
            !inventory ||
            inventory.status !==
            "Em conferência"
        ) {

            return;
        }


        const product =
            products.find(
                product =>
                    product.id ===
                    inventory.productId
            );


        if (!product) {

            openSystemDialog({
                type: "error",
                eyebrow: "INVENTÁRIO",
                title: "Produto não encontrado",
                message:
                    "Não foi possível localizar o produto deste inventário."
            });

            return;
        }


        const currentStock =
            Number(
                product.stock || 0
            );


        if (
            currentStock !==
            Number(inventory.systemStock)
        ) {

            openSystemDialog({
                type: "warning",
                eyebrow: "INTEGRIDADE DE ESTOQUE",
                title: "Saldo alterado após a contagem",
                message:
                    `O inventário foi aberto com saldo ${inventory.systemStock}, mas o saldo atual é ${currentStock}. Cancele esta contagem e realize um novo inventário.`
            });

            return;
        }


        const difference =
            Number(
                inventory.difference || 0
            );


        openSystemDialog({

            type: "question",

            eyebrow: "APROVAÇÃO DE INVENTÁRIO",

            title:
                difference === 0
                    ? "Concluir inventário?"
                    : "Aprovar divergência?",

            message:
                difference === 0
                    ? `${inventory.code} não possui divergência. O inventário será concluído sem movimentar o estoque.`
                    : `O saldo de ${product.name} será alterado de ${currentStock} para ${inventory.physicalStock} ${product.unit}.`,

            confirmText:
                difference === 0
                    ? "Concluir"
                    : "Aprovar",

            cancelText:
                "Voltar",

            showCancel:
                true,

            onConfirm: () => {

                concludeInventory(
                    inventory,
                    product
                );
            }

        });
    }


    function concludeInventory(
        inventory,
        product
    ) {

        const previousStock =
            Number(
                product.stock || 0
            );

        const physicalStock =
            Number(
                inventory.physicalStock
            );

        const difference =
            physicalStock -
            previousStock;


        if (difference !== 0) {

            product.stock =
                physicalStock;


            movements.unshift({

                id: generateId(),

                type:
                    "Ajuste de Inventário",

                supplierId: null,

                supplierName: "-",

                supplierCnpj: "-",

                productId:
                    product.id,

                sku:
                    product.sku,

                productName:
                    product.name,

                quantity:
                    Math.abs(difference),

                adjustmentDifference:
                    difference,

                previousStock,

                physicalStock,

                newStock:
                    physicalStock,

                unit:
                    product.unit,

                location:
                    product.location,

                document:
                    inventory.code,

                reason:
                    "Divergência de inventário",

                notes:
                    inventory.notes || "-",

                inventoryId:
                    inventory.id,

                inventoryCode:
                    inventory.code,

                responsible:
                    "Gabriel",

                createdAt:
                    new Date().toISOString()

            });

        }


        inventory.status =
            "Concluído";

        inventory.approvedBy =
            "Gabriel";

        inventory.completedAt =
            new Date().toISOString();


        saveProducts();

        saveMovements();

        saveInventories();

        refreshSystem();


        openSystemDialog({
            type: "success",
            eyebrow: "INVENTÁRIO",
            title: "Inventário concluído",
            message:
                difference === 0
                    ? `${inventory.code} foi concluído sem divergências.`
                    : `${inventory.code} foi concluído. Ajuste de ${difference > 0 ? "+" : ""}${difference} ${product.unit} registrado automaticamente.`
        });
    }


    function cancelInventory(id) {

        const inventory =
            inventories.find(
                inventory =>
                    inventory.id === id
            );


        if (
            !inventory ||
            inventory.status !==
            "Em conferência"
        ) {

            return;
        }


        openSystemDialog({

            type: "question",

            eyebrow: "INVENTÁRIO",

            title: "Cancelar inventário?",

            message:
                `${inventory.code} será cancelado sem alterar o estoque.`,

            confirmText:
                "Cancelar inventário",

            cancelText:
                "Voltar",

            showCancel:
                true,

            onConfirm: () => {

                inventory.status =
                    "Cancelado";

                inventory.cancelledAt =
                    new Date().toISOString();


                saveInventories();

                refreshSystem();


                openSystemDialog({
                    type: "success",
                    eyebrow: "INVENTÁRIO",
                    title: "Inventário cancelado",
                    message:
                        `${inventory.code} foi cancelado e o histórico foi preservado.`
                });

            }

        });
    }


    inventorySearch?.addEventListener(
        "input",
        renderInventories
    );


    inventoryStatusFilter?.addEventListener(
        "change",
        renderInventories
    );


    /* =========================================================
       POSIÇÃO DE ESTOQUE
    ========================================================= */

    function renderStockTable() {

        const body =
            document.getElementById(
                "stockTableBody"
            );


        if (!body) return;


        body.innerHTML =
            products.length
                ? products.map(product => {

                    const status =
                        getStockStatus(product);


                    return `

                    <tr>

                        <td>
                            <strong>
                                ${product.sku}
                            </strong>
                        </td>

                        <td>
                            ${product.name}
                        </td>

                        <td>
                            ${product.location || "-"}
                        </td>

                        <td>
                            ${Number(product.stock || 0)}
                            ${product.unit || ""}
                        </td>

                        <td>
                            ${Number(product.minimum || 0)}
                        </td>

                        <td>
                            <span class="${status.className}">
                                ${status.label}
                            </span>
                        </td>

                    </tr>

                `;

                }).join("")
                : `

                <tr>

                    <td colspan="6">
                        Nenhum produto cadastrado.
                    </td>

                </tr>

            `;
    }


    /* =========================================================
       MOVIMENTAÇÕES
    ========================================================= */

    const movementSearch =
        document.getElementById(
            "movementSearch"
        );

    const movementTypeFilter =
        document.getElementById(
            "movementTypeFilter"
        );


    function renderMovements() {

        const body =
            document.getElementById(
                "movementsTableBody"
            );


        if (!body) return;


        const search =
            normalizeText(
                movementSearch?.value
            );

        const type =
            movementTypeFilter?.value || "";


        const filtered =
            movements.filter(
                movement => {

                    const content =
                        normalizeText(
                            `${movement.sku} ${movement.productName} ${movement.document} ${movement.supplierName} ${movement.responsible}`
                        );


                    return (
                        content.includes(search) &&
                        (
                            !type ||
                            movement.type === type
                        )
                    );

                }
            );


        body.innerHTML =
            filtered.length
                ? filtered.map(movement => `

                <tr>

                    <td>
                        ${formatDateTime(
                    movement.createdAt
                )}
                    </td>

                    <td>
                        ${movement.type}
                    </td>

                    <td>
                        <strong>
                            ${movement.sku}
                        </strong>
                    </td>

                    <td>
                        ${movement.productName}
                    </td>

                    <td>
                        <span class="${getMovementQuantityClass(movement)}">
                            ${getMovementQuantityText(movement)}
                            ${movement.unit || ""}
                        </span>
                    </td>

                    <td>
                        ${movement.previousStock ?? "-"}
                        →
                        ${movement.newStock ?? "-"}
                    </td>

                    <td>
                        ${movement.document || "-"}
                    </td>

                    <td>
                        ${movement.supplierName || "-"}
                    </td>

                    <td>
                        ${movement.responsible || "-"}
                    </td>

                </tr>

            `).join("")
                : `

                <tr>

                    <td colspan="9">
                        Nenhuma movimentação encontrada.
                    </td>

                </tr>

            `;
    }


    movementSearch?.addEventListener(
        "input",
        renderMovements
    );


    movementTypeFilter?.addEventListener(
        "change",
        renderMovements
    );


    /* =========================================================
       DASHBOARD
    ========================================================= */

    function renderDashboard() {

        const activeProducts =
            products.filter(
                product =>
                    product.status === "Ativo"
            );


        const totalStock =
            products.reduce(
                (total, product) =>
                    total +
                    Number(product.stock || 0),
                0
            );


        const critical =
            activeProducts.filter(
                product =>
                    Number(product.stock || 0) <=
                    Number(product.minimum || 0)
            );


        const today =
            getDateKey(
                new Date()
            );


        const todayMovements =
            movements.filter(
                movement =>
                    getDateKey(
                        new Date(
                            movement.createdAt
                        )
                    ) === today
            );


        document.getElementById(
            "metricActiveProducts"
        ).textContent =
            activeProducts.length;


        document.getElementById(
            "metricTotalStock"
        ).textContent =
            totalStock;


        document.getElementById(
            "metricCriticalStock"
        ).textContent =
            critical.length;


        document.getElementById(
            "metricTodayMovements"
        ).textContent =
            todayMovements.length;


        renderCriticalStock(
            critical
        );

        renderLastMovement();
    }


    function renderCriticalStock(
        critical
    ) {

        const container =
            document.getElementById(
                "criticalStockList"
            );


        if (!container) return;


        if (!critical.length) {

            container.innerHTML =
                `<p>Nenhum produto crítico.</p>`;

            return;
        }


        container.innerHTML =
            critical.slice(0, 5)
                .map(product => `

                <div class="critical-item">

                    <div>

                        <strong>
                            ${product.sku}
                        </strong>

                        <span>
                            ${product.name}
                        </span>

                    </div>

                    <strong>
                        ${product.stock}
                        ${product.unit}
                    </strong>

                </div>

            `).join("");
    }


    function renderLastMovement() {

        const container =
            document.getElementById(
                "lastMovement"
            );


        if (!container) return;


        if (!movements.length) {

            container.innerHTML =
                `<p>Nenhuma movimentação registrada.</p>`;

            return;
        }


        const movement =
            movements[0];


        container.innerHTML = `

        <div>

            <span class="eyebrow">
                ${movement.type}
            </span>

            <h3>
                ${movement.sku}
                •
                ${movement.productName}
            </h3>

            <p>
                Quantidade:
                <strong>
                    ${getMovementQuantityText(movement)}
                    ${movement.unit || ""}
                </strong>
            </p>

            <p>
                Documento:
                ${movement.document || "-"}
            </p>

            <p>
                ${formatDateTime(
            movement.createdAt
        )}
                •
                ${movement.responsible || "-"}
            </p>

        </div>

    `;
    }


    /* =========================================================
       GRÁFICO
    ========================================================= */

    let movementChartInstance = null;


    function renderMovementChart() {

        const canvas =
            document.getElementById(
                "movementChart"
            );


        if (
            !canvas ||
            typeof Chart === "undefined"
        ) {

            return;
        }


        const period =
            Number(
                document.getElementById(
                    "chartPeriod"
                )?.value || 7
            );


        const labels = [];

        const entries = [];

        const exits = [];


        for (
            let index = period - 1;
            index >= 0;
            index--
        ) {

            const date =
                new Date();

            date.setDate(
                date.getDate() - index
            );


            const key =
                getDateKey(date);


            const label =
                date.toLocaleDateString(
                    "pt-BR",
                    {
                        day: "2-digit",
                        month: "2-digit"
                    }
                );


            labels.push(label);


            let entryTotal = 0;

            let exitTotal = 0;


            movements.forEach(
                movement => {

                    if (
                        movement.type !== "Entrada" &&
                        movement.type !== "Saída"
                    ) {

                        return;
                    }


                    const movementDate =
                        new Date(
                            movement.createdAt
                        );


                    if (
                        getDateKey(
                            movementDate
                        ) !== key
                    ) {

                        return;
                    }


                    if (
                        movement.type ===
                        "Entrada"
                    ) {

                        entryTotal +=
                            Number(
                                movement.quantity || 0
                            );

                    }


                    if (
                        movement.type ===
                        "Saída"
                    ) {

                        exitTotal +=
                            Number(
                                movement.quantity || 0
                            );

                    }

                }
            );


            entries.push(
                entryTotal
            );

            exits.push(
                exitTotal
            );

        }


        if (movementChartInstance) {

            movementChartInstance.destroy();
        }


        movementChartInstance =
            new Chart(
                canvas,
                {

                    type: "line",

                    data: {

                        labels,

                        datasets: [

                            {
                                label: "Entradas",
                                data: entries,
                                tension: 0.3,
                                fill: false
                            },

                            {
                                label: "Saídas",
                                data: exits,
                                tension: 0.3,
                                fill: false
                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        interaction: {
                            mode: "index",
                            intersect: false
                        },

                        scales: {

                            y: {
                                beginAtZero: true
                            }

                        }

                    }

                }
            );
    }


    document.getElementById(
        "chartPeriod"
    )?.addEventListener(
        "change",
        renderMovementChart
    );


    /* =========================================================
       RELATÓRIOS
    ========================================================= */

    const reportTypeFilter =
        document.getElementById(
            "reportTypeFilter"
        );

    const reportPeriodFilter =
        document.getElementById(
            "reportPeriodFilter"
        );

    const reportSearch =
        document.getElementById(
            "reportSearch"
        );

    const reportTableHead =
        document.getElementById(
            "reportTableHead"
        );

    const reportTableBody =
        document.getElementById(
            "reportTableBody"
        );

    const exportReportButton =
        document.getElementById(
            "exportReportButton"
        );


    function getReportStartDate() {

        const period =
            reportPeriodFilter?.value ||
            "30";


        if (period === "all") {

            return null;
        }


        const date =
            new Date();


        date.setDate(
            date.getDate() -
            Number(period) +
            1
        );


        date.setHours(
            0,
            0,
            0,
            0
        );


        return date;
    }


    function filterMovementsByReportPeriod(
        list
    ) {

        const startDate =
            getReportStartDate();


        if (!startDate) {

            return list;
        }


        return list.filter(
            movement => {

                const date =
                    new Date(
                        movement.createdAt
                    );
                return (
                    !Number.isNaN(
                        date.getTime()
                    ) &&
                    date >= startDate
                );

            }
        );
    }


    function updateReportIndicators() {

        if (!reportTypeFilter) return;


        const totalStock =
            products.reduce(
                (total, product) =>
                    total +
                    Number(
                        product.stock || 0
                    ),
                0
            );


        const periodMovements =
            filterMovementsByReportPeriod(
                movements
            );


        const entries =
            periodMovements
                .filter(
                    movement =>
                        movement.type ===
                        "Entrada"
                )
                .reduce(
                    (total, movement) =>
                        total +
                        Number(
                            movement.quantity || 0
                        ),
                    0
                );


        const exits =
            periodMovements
                .filter(
                    movement =>
                        movement.type ===
                        "Saída"
                )
                .reduce(
                    (total, movement) =>
                        total +
                        Number(
                            movement.quantity || 0
                        ),
                    0
                );


        const critical =
            products.filter(
                product =>
                    product.status === "Ativo" &&
                    Number(
                        product.stock || 0
                    ) <=
                    Number(
                        product.minimum || 0
                    )
            ).length;


        document.getElementById(
            "reportTotalStock"
        ).textContent =
            totalStock;


        document.getElementById(
            "reportTotalEntries"
        ).textContent =
            entries;


        document.getElementById(
            "reportTotalExits"
        ).textContent =
            exits;


        document.getElementById(
            "reportCriticalProducts"
        ).textContent =
            critical;
    }


    function renderStockReport() {

        const search =
            normalizeText(
                reportSearch?.value
            );


        const filtered =
            products.filter(
                product => {

                    const content =
                        normalizeText(
                            `${product.sku} ${product.name} ${product.category} ${product.location}`
                        );


                    return content.includes(
                        search
                    );

                }
            );


        reportTableHead.innerHTML = `

        <tr>
            <th>SKU</th>
            <th>PRODUTO</th>
            <th>CATEGORIA</th>
            <th>ENDEREÇO</th>
            <th>ESTOQUE</th>
            <th>MÍNIMO</th>
            <th>UNIDADE</th>
            <th>SITUAÇÃO</th>
        </tr>

    `;


        reportTableBody.innerHTML =
            filtered.length
                ? filtered.map(product => {

                    const status =
                        getStockStatus(
                            product
                        );


                    return `

                    <tr>

                        <td>
                            <strong>
                                ${product.sku}
                            </strong>
                        </td>

                        <td>
                            ${product.name}
                        </td>

                        <td>
                            ${product.category || "-"}
                        </td>

                        <td>
                            ${product.location || "-"}
                        </td>

                        <td>
                            ${product.stock || 0}
                        </td>

                        <td>
                            ${product.minimum || 0}
                        </td>

                        <td>
                            ${product.unit || "-"}
                        </td>

                        <td>
                            <span class="${status.className}">
                                ${status.label}
                            </span>
                        </td>

                    </tr>

                `;

                }).join("")
                : `

                <tr>
                    <td colspan="8">
                        Nenhum produto encontrado.
                    </td>
                </tr>

            `;
    }


    function renderCriticalReport() {

        const search =
            normalizeText(
                reportSearch?.value
            );


        const filtered =
            products.filter(
                product => {

                    const stock =
                        Number(
                            product.stock || 0
                        );

                    const minimum =
                        Number(
                            product.minimum || 0
                        );


                    const content =
                        normalizeText(
                            `${product.sku} ${product.name} ${product.category} ${product.location}`
                        );


                    return (
                        product.status === "Ativo" &&
                        stock <= minimum &&
                        content.includes(search)
                    );

                }
            );


        reportTableHead.innerHTML = `

        <tr>
            <th>SKU</th>
            <th>PRODUTO</th>
            <th>ENDEREÇO</th>
            <th>ESTOQUE ATUAL</th>
            <th>ESTOQUE MÍNIMO</th>
            <th>SITUAÇÃO</th>
        </tr>

    `;


        reportTableBody.innerHTML =
            filtered.length
                ? filtered.map(product => {

                    const status =
                        getStockStatus(
                            product
                        );


                    return `

                    <tr>

                        <td>
                            <strong>
                                ${product.sku}
                            </strong>
                        </td>

                        <td>
                            ${product.name}
                        </td>

                        <td>
                            ${product.location || "-"}
                        </td>

                        <td>
                            ${product.stock || 0}
                            ${product.unit || ""}
                        </td>

                        <td>
                            ${product.minimum || 0}
                            ${product.unit || ""}
                        </td>

                        <td>
                            <span class="${status.className}">
                                ${status.label}
                            </span>
                        </td>

                    </tr>

                `;

                }).join("")
                : `

                <tr>
                    <td colspan="6">
                        Nenhum produto crítico encontrado.
                    </td>
                </tr>

            `;
    }


    function renderMovementReport(
        type
    ) {

        const search =
            normalizeText(
                reportSearch?.value
            );


        const periodMovements =
            filterMovementsByReportPeriod(
                movements
            );


        const filtered =
            periodMovements.filter(
                movement => {

                    if (
                        movement.type !== type
                    ) {

                        return false;
                    }


                    const content =
                        normalizeText(
                            `${movement.sku} ${movement.productName} ${movement.document} ${movement.supplierName} ${movement.reason} ${movement.responsible}`
                        );


                    return content.includes(
                        search
                    );

                }
            );


        reportTableHead.innerHTML = `

        <tr>
            <th>DATA</th>
            <th>TIPO</th>
            <th>SKU</th>
            <th>PRODUTO</th>
            <th>QUANTIDADE</th>
            <th>SALDO</th>
            <th>DOCUMENTO</th>
            <th>FORNECEDOR</th>
            <th>RESPONSÁVEL</th>
        </tr>

    `;


        reportTableBody.innerHTML =
            filtered.length
                ? filtered.map(movement => `

                <tr>

                    <td>
                        ${formatDateTime(
                    movement.createdAt
                )}
                    </td>

                    <td>
                        ${movement.type}
                    </td>

                    <td>
                        <strong>
                            ${movement.sku}
                        </strong>
                    </td>

                    <td>
                        ${movement.productName}
                    </td>

                    <td>
                        ${getMovementQuantityText(
                    movement
                )}
                        ${movement.unit || ""}
                    </td>

                    <td>
                        ${movement.previousStock ?? "-"}
                        →
                        ${movement.newStock ?? "-"}
                    </td>

                    <td>
                        ${movement.document || "-"}
                    </td>

                    <td>
                        ${movement.supplierName || "-"}
                    </td>

                    <td>
                        ${movement.responsible || "-"}
                    </td>

                </tr>

            `).join("")
                : `

                <tr>
                    <td colspan="9">
                        Nenhuma movimentação encontrada.
                    </td>
                </tr>

            `;
    }


    function renderInventoryReport() {

        const search =
            normalizeText(
                reportSearch?.value
            );


        const startDate =
            getReportStartDate();


        const filtered =
            inventories.filter(
                inventory => {

                    if (startDate) {

                        const date =
                            new Date(
                                inventory.createdAt
                            );


                        if (
                            Number.isNaN(
                                date.getTime()
                            ) ||
                            date < startDate
                        ) {

                            return false;
                        }

                    }


                    const content =
                        normalizeText(
                            `${inventory.code} ${inventory.sku} ${inventory.productName} ${inventory.location} ${inventory.status} ${inventory.responsible}`
                        );


                    return content.includes(
                        search
                    );

                }
            );


        reportTableHead.innerHTML = `

        <tr>
            <th>INVENTÁRIO</th>
            <th>DATA</th>
            <th>SKU</th>
            <th>PRODUTO</th>
            <th>SISTEMA</th>
            <th>CONTAGEM</th>
            <th>DIVERGÊNCIA</th>
            <th>STATUS</th>
            <th>RESPONSÁVEL</th>
        </tr>

    `;


        reportTableBody.innerHTML =
            filtered.length
                ? filtered.map(inventory => {

                    const difference =
                        Number(
                            inventory.difference || 0
                        );


                    return `

                    <tr>

                        <td>
                            <strong>
                                ${inventory.code}
                            </strong>
                        </td>

                        <td>
                            ${formatDateTime(
                        inventory.createdAt
                    )}
                        </td>

                        <td>
                            ${inventory.sku}
                        </td>

                        <td>
                            ${inventory.productName}
                        </td>

                        <td>
                            ${inventory.systemStock}
                        </td>

                        <td>
                            ${inventory.physicalStock}
                        </td>

                        <td>
                            <strong>
                                ${difference > 0
                            ? "+"
                            : ""
                        }${difference}
                            </strong>
                        </td>

                        <td>
                            ${inventory.status}
                        </td>

                        <td>
                            ${inventory.responsible || "-"}
                        </td>

                    </tr>

                `;

                }).join("")
                : `

                <tr>
                    <td colspan="9">
                        Nenhum inventário encontrado.
                    </td>
                </tr>

            `;
    }


    function renderReports() {

        if (
            !reportTypeFilter ||
            !reportTableHead ||
            !reportTableBody
        ) {

            return;
        }


        updateReportIndicators();


        const type =
            reportTypeFilter.value;


        if (type === "stock") {

            renderStockReport();

            return;
        }


        if (type === "critical") {

            renderCriticalReport();

            return;
        }


        if (type === "inventory") {

            renderInventoryReport();

            return;
        }


        renderMovementReport(
            type
        );
    }


    reportTypeFilter?.addEventListener(
        "change",
        renderReports
    );


    reportPeriodFilter?.addEventListener(
        "change",
        renderReports
    );


    reportSearch?.addEventListener(
        "input",
        renderReports
    );


    /* =========================================================
       EXPORTAÇÃO CSV
    ========================================================= */

    function escapeCSV(value) {

        const text =
            String(value ?? "");

        return `"${text.replace(
            /"/g,
            '""'
        )}"`;
    }


    function exportCurrentReport() {

        const headers =
            Array.from(
                reportTableHead.querySelectorAll(
                    "th"
                )
            );


        const rows =
            Array.from(
                reportTableBody.querySelectorAll(
                    "tr"
                )
            );


        if (!headers.length) {

            openSystemDialog({
                type: "warning",
                eyebrow: "RELATÓRIOS",
                title: "Relatório vazio",
                message:
                    "Selecione um relatório válido antes de exportar."
            });

            return;
        }


        const csvRows = [

            headers
                .map(
                    header =>
                        escapeCSV(
                            header.textContent.trim()
                        )
                )
                .join(";")

        ];


        rows.forEach(
            row => {

                const cells =
                    Array.from(
                        row.querySelectorAll(
                            "td"
                        )
                    );


                if (
                    cells.length !==
                    headers.length
                ) {

                    return;
                }


                csvRows.push(

                    cells
                        .map(
                            cell =>
                                escapeCSV(
                                    cell.textContent
                                        .replace(
                                            /\s+/g,
                                            " "
                                        )
                                        .trim()
                                )
                        )
                        .join(";")

                );

            }
        );


        if (
            csvRows.length === 1
        ) {

            openSystemDialog({
                type: "warning",
                eyebrow: "RELATÓRIOS",
                title: "Nada para exportar",
                message:
                    "Não existem registros no relatório atual."
            });

            return;
        }


        const content =
            "\uFEFF" +
            csvRows.join("\n");


        const blob =
            new Blob(
                [content],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        const date =
            getDateKey(
                new Date()
            );


        link.href =
            url;


        link.download =
            `GB-WMS-${reportTypeFilter.value}-${date}.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );
    }


    exportReportButton?.addEventListener(
        "click",
        exportCurrentReport
    );


    /* =========================================================
       BUSCA GLOBAL
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
                event.key.toLowerCase() ===
                "k"
            ) {

                event.preventDefault();

                globalSearch?.focus();

            }

        }
    );


    /* =========================================================
       ATUALIZAÇÃO GERAL DO SISTEMA
    ========================================================= */

    function refreshSystem() {

        renderProducts();

        renderSuppliers();

        renderStockTable();

        renderMovements();

        renderInventories();

        renderDashboard();

        renderReports();

        renderMovementChart();
    }


    /* =========================================================
       INICIALIZAÇÃO
    ========================================================= */

    refreshSystem();
}
