import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.css'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

export function useGridStack(availableWidgets) {
    let grid = null
    let widgets = reactive([])
    let hasUpdate = ref(false)

    onMounted(() => {
        grid = GridStack.init({
            // DO NOT use grid.value = GridStack.init(), see above
            float: true,
            cellHeight: '164px',
            minRow: 1,
        })

        grid.on('dragstop', (event, element) => {
            let wIndex = availableWidgets.findIndex(
                (widget) => widget.id === element.getAttribute('gs-id'),
            )
            availableWidgets[wIndex].gs.x = Number(element.getAttribute('gs-x'))
            availableWidgets[wIndex].gs.y = Number(element.getAttribute('gs-y'))
            availableWidgets[wIndex].gs.width = Number(
                element.getAttribute('gs-w'),
            )
            availableWidgets[wIndex].gs.height = Number(
                element.getAttribute('gs-h'),
            )
            hasUpdate.value = true
        })

        grid.on('resizestop', (event, element) => {
            let wIndex = availableWidgets.findIndex(
                (widget) => widget.id === element.getAttribute('gs-id'),
            )
            availableWidgets[wIndex].gs.width = Number(
                element.getAttribute('gs-w'),
            )
            availableWidgets[wIndex].gs.height = Number(
                element.getAttribute('gs-h'),
            )
            hasUpdate.value = true
        })

        syncWidgets(availableWidgets)
        hasUpdate.value = false
    })

    function addWidget(widget) {
        widgets.push(widget)
        nextTick(() => {
            let element = document.querySelector('[gs-id="' + widget.id + '"]')
            grid.makeWidget(element)
        })
    }

    function removeWidget(w) {
        let index = widgets.findIndex((widget) => widget.id === w.id)
        widgets.splice(index, 1)
        grid.removeWidget(w.id)
    }

    function syncWidgets(w) {
        let domActivesIds = Array.from(
            document.querySelectorAll('.grid-stack-item'),
        ).map((el) => el.getAttribute('gs-id'))

        let widgetToRemove = w.filter(
            (_w) => !_w.active && domActivesIds.includes(_w.id),
        )
        let widgetToAdd = w.filter(
            (_w) => _w.active && !domActivesIds.includes(_w.id),
        )

        widgetToRemove.forEach((w) => {
            removeWidget(w)
        })
        widgetToAdd.forEach((w) => {
            addWidget(w)
        })
    }

    watch(
        availableWidgets,
        () => {
            syncWidgets(availableWidgets)
        },
        { deep: true },
    )

    return { widgets, hasUpdate }
}
