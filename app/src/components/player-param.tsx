import { ExternalLinkIcon } from "@chakra-ui/icons"
import { Badge, HStack, Link, VStack, Text } from "@chakra-ui/react"

export const PlayerParamComponent = (prop: {
    power: number,
    control: number,
    sprint: number
}) => {
    const {power, control, sprint} = prop

    return (
        <VStack alignItems={'self-start'}>
            <HStack>
                <Badge variant='subtle' colorScheme='red'>
                    POWER
                </Badge>
                <p>{createGauge(power)}</p>
            </HStack>
            <HStack>
                <Badge variant='subtle' colorScheme='yellow'>
                    CNTRL
                </Badge>
                <p>{createGauge(control)}</p>
            </HStack>
            <HStack>
                <Badge variant='subtle' colorScheme='cyan'>
                    SPRNT
                </Badge>
                <p>{createGauge(sprint)}</p>
            </HStack>
        </VStack>
    )
}

const createGauge = (n: number): string => {
    let s = ''
    for(let i=0;i<n;i++){
        s += '▍'
    }
    s += n
    return s
}