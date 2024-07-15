import moment from 'moment'

export class GraphServices {
    static filterDates(start, end, prop = 'createdAt', addtionalFilter = {}) {
        return {
            $match: {
                [prop]: {
                    $gte: new Date(start),
                    $lte: new Date(end),
                },
                ...addtionalFilter,
            },
        }
    }

    static getGroupBy(
        start,
        end,
        interval,
        prop = 'createdAt',
        additionalGroupBy = {},
    ) {
        // Définir le format d'agrégation en fonction de l'intervalle
        let groupBy
        switch (interval) {
            case 'day':
                groupBy = {
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$' + prop,
                        },
                    },
                    year: { $year: '$' + prop },
                    month: { $month: '$' + prop },
                    day: { $dayOfMonth: '$' + prop },
                    ...additionalGroupBy,
                }
                break
            case 'week':
                groupBy = {
                    date: {
                        $dateToString: {
                            format: '%Y-%U',
                            date: '$' + prop,
                        },
                    },
                    year: { $year: '$' + prop },
                    week: { $week: '$' + prop },
                    ...additionalGroupBy,
                }
                break
            case 'month':
                groupBy = {
                    date: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: '$' + prop,
                        },
                    },
                    year: { $year: '$' + prop },
                    month: { $month: '$' + prop },
                    ...additionalGroupBy,
                }
                break
            case 'year':
                groupBy = {
                    date: {
                        $dateToString: {
                            format: '%Y',
                            date: '$' + prop,
                        },
                    },
                    year: { $year: '$' + prop },
                    ...additionalGroupBy,
                }
                break
            default:
                throw new Error('No valid interval')
        }

        return groupBy
    }

    static fillMissingDates(groupedResult, start, end, interval) {
        const dateRange = this.generateDateRange(start, end, interval)
        return dateRange.map((date) => {
            const found = groupedResult.find((res) => res._id.date === date)
            const label = interval === 'w'

            return {
                label: this.generateLabels(date, interval),
                ...found,
                count: found ? found.count : 0,
            }
        })
    }

    static generateLabels(date, interval) {
        const dateMoment = moment(date)
        switch (interval) {
            case 'day':
                return dateMoment.format('DD/MM/YYYY')
            case 'week':
                return (
                    dateMoment.startOf('week').format('DD/MM/YYYY') +
                    ' - ' +
                    dateMoment.endOf('week').format('DD/MM/YYYY')
                )
            case 'month':
                return dateMoment.format('MMMM')
            case 'year':
                return dateMoment.format('YYYY')
            default:
                return dateMoment.format('DD/MM/YYYY')
        }
    }

    static generateDateRange(start, end, interval) {
        const range = []
        const current = moment(start)
        const endMoment = moment(end)

        while (current <= endMoment) {
            range.push(current.format(this.intervalFormat(interval)))
            current.add(1, interval) // Ajouter l'intervalle
        }

        if (range.length < 2) {
            //add the past interval
            range.unshift(
                moment(start)
                    .subtract(1, interval)
                    .format(this.intervalFormat(interval)),
            )
        }

        return range
    }

    static intervalFormat(interval) {
        switch (interval) {
            case 'day':
                return 'YYYY-MM-DD'
            case 'week':
                return 'YYYY-[W]WW'
            case 'month':
                return 'YYYY-MM'
            case 'year':
                return 'YYYY'
            default:
                return 'YYYY-MM-DD'
        }
    }
}
