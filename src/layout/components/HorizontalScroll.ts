interface ExtendedWheelEvent extends WheelEvent {
  wheelDelta?: number
}

export default class HorizontalScroll {
  private el: HTMLElement
  constructor(nativeElement: HTMLElement) {
    this.el = nativeElement
    this.handleWheelEvent()
  }
  handleWheelEvent() {
    let wheel = ''
    if ('onmousewheel' in this.el) {
      wheel = 'mousewheel'
    } else if ('onwheel' in this.el) {
      wheel = 'wheel'
    } else if ('attachEvent' in window) {
      wheel = 'onmousewheel'
    } else {
      wheel = 'DOMMouseScroll'
    }
    this.el.addEventListener(wheel as keyof HTMLElementEventMap, this.scroll as EventListener)
  }
  scroll = (event: Event) => {
    if (this.el.clientWidth >= this.el.scrollWidth) {
      return
    }
    event.preventDefault()
    const wheelEvent = event as ExtendedWheelEvent
    this.el.scrollLeft += wheelEvent.deltaY
      ? wheelEvent.deltaY
      : wheelEvent.detail && wheelEvent.detail !== 0
        ? wheelEvent.detail
        : -(wheelEvent.wheelDelta || 0)
  }
}
