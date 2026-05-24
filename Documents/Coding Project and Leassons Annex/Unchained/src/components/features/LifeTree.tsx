import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Line } from 'react-native-svg';
import { colors } from '@/theme';

interface Props {
  days: number;
  isRelapsed?: boolean;
  size?: number;
}

// Returns a 0–1 growth factor for a given day count
function growthFactor(days: number): number {
  if (days === 0) return 0;
  if (days < 1) return 0.05;
  if (days < 3) return 0.12;
  if (days < 7) return 0.22;
  if (days < 14) return 0.38;
  if (days < 30) return 0.55;
  if (days < 60) return 0.72;
  if (days < 90) return 0.88;
  return 1;
}

// Returns the stage 0–7
function getStage(days: number): number {
  if (days >= 90) return 7;
  if (days >= 60) return 6;
  if (days >= 30) return 5;
  if (days >= 14) return 4;
  if (days >= 7) return 3;
  if (days >= 3) return 2;
  if (days >= 1) return 1;
  return 0;
}

const STAGE_COLORS = [
  '#3D5A3D', // seed
  '#4A7A4A', // sprout
  '#4CAF6E', // first growth
  '#4CAF82', // week 1
  '#52C48E', // two weeks
  '#5ABF8A', // month 1
  '#62B87C', // two months
  '#C9A84C', // ancient — gold
];

function TreeSvg({ days, isRelapsed, size = 220 }: Props) {
  const g = growthFactor(days);
  const stage = getStage(days);
  const trunkColor = isRelapsed ? '#5A4A3A' : '#6B5A3E';
  const leafColor = isRelapsed ? '#4A5A4A' : STAGE_COLORS[stage];
  const rootColor = isRelapsed ? '#3A3028' : '#4E3C24';
  const cx = size / 2;
  const cy = size * 0.62;

  // Trunk height scales with growth
  const trunkH = size * 0.08 + g * size * 0.22;
  const trunkW = size * 0.03 + g * size * 0.025;
  const trunkTop = cy - trunkH;

  // Canopy
  const canopyR = g * size * 0.26;

  // Roots
  const rootDepth = size * 0.04 + g * size * 0.14;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Roots — deepen with stage */}
      {stage >= 2 && (
        <G opacity={0.7}>
          <Path
            d={`M${cx} ${cy} Q${cx - size * 0.08} ${cy + rootDepth * 0.5} ${cx - size * 0.16} ${cy + rootDepth}`}
            stroke={rootColor} strokeWidth={trunkW * 0.9} fill="none" strokeLinecap="round"
          />
          <Path
            d={`M${cx} ${cy} Q${cx + size * 0.08} ${cy + rootDepth * 0.5} ${cx + size * 0.16} ${cy + rootDepth}`}
            stroke={rootColor} strokeWidth={trunkW * 0.9} fill="none" strokeLinecap="round"
          />
          {stage >= 4 && (
            <>
              <Path
                d={`M${cx - size * 0.05} ${cy + rootDepth * 0.4} Q${cx - size * 0.13} ${cy + rootDepth * 0.9} ${cx - size * 0.06} ${cy + rootDepth * 1.1}`}
                stroke={rootColor} strokeWidth={trunkW * 0.55} fill="none" strokeLinecap="round"
              />
              <Path
                d={`M${cx + size * 0.05} ${cy + rootDepth * 0.4} Q${cx + size * 0.13} ${cy + rootDepth * 0.9} ${cx + size * 0.06} ${cy + rootDepth * 1.1}`}
                stroke={rootColor} strokeWidth={trunkW * 0.55} fill="none" strokeLinecap="round"
              />
            </>
          )}
          {stage >= 6 && (
            <>
              <Path
                d={`M${cx} ${cy} Q${cx - size * 0.01} ${cy + rootDepth * 0.7} ${cx} ${cy + rootDepth * 1.1}`}
                stroke={rootColor} strokeWidth={trunkW * 0.7} fill="none" strokeLinecap="round"
              />
              <Path
                d={`M${cx - size * 0.1} ${cy + rootDepth * 0.7} Q${cx - size * 0.22} ${cy + rootDepth} ${cx - size * 0.26} ${cy + rootDepth * 0.95}`}
                stroke={rootColor} strokeWidth={trunkW * 0.45} fill="none" strokeLinecap="round"
              />
              <Path
                d={`M${cx + size * 0.1} ${cy + rootDepth * 0.7} Q${cx + size * 0.22} ${cy + rootDepth} ${cx + size * 0.26} ${cy + rootDepth * 0.95}`}
                stroke={rootColor} strokeWidth={trunkW * 0.45} fill="none" strokeLinecap="round"
              />
            </>
          )}
        </G>
      )}

      {/* Trunk */}
      {stage === 0 ? (
        // Seed
        <Ellipse cx={cx} cy={cy + size * 0.02} rx={size * 0.025} ry={size * 0.035} fill={leafColor} opacity={0.9} />
      ) : (
        <Path
          d={`M${cx - trunkW / 2} ${cy} Q${cx - trunkW * 0.3} ${(cy + trunkTop) / 2} ${cx} ${trunkTop}`}
          stroke={trunkColor} strokeWidth={trunkW} fill="none" strokeLinecap="round"
        />
      )}

      {/* Branches — appear at stage 3+ */}
      {stage >= 3 && (
        <G opacity={0.85}>
          <Path
            d={`M${cx} ${trunkTop + trunkH * 0.3} Q${cx - canopyR * 0.6} ${trunkTop} ${cx - canopyR * 0.55} ${trunkTop - canopyR * 0.2}`}
            stroke={trunkColor} strokeWidth={trunkW * 0.55} fill="none" strokeLinecap="round"
          />
          <Path
            d={`M${cx} ${trunkTop + trunkH * 0.3} Q${cx + canopyR * 0.6} ${trunkTop} ${cx + canopyR * 0.55} ${trunkTop - canopyR * 0.2}`}
            stroke={trunkColor} strokeWidth={trunkW * 0.55} fill="none" strokeLinecap="round"
          />
        </G>
      )}
      {stage >= 5 && (
        <G opacity={0.7}>
          <Path
            d={`M${cx - canopyR * 0.4} ${trunkTop + trunkH * 0.1} Q${cx - canopyR * 0.9} ${trunkTop - canopyR * 0.1} ${cx - canopyR * 0.85} ${trunkTop - canopyR * 0.45}`}
            stroke={trunkColor} strokeWidth={trunkW * 0.38} fill="none" strokeLinecap="round"
          />
          <Path
            d={`M${cx + canopyR * 0.4} ${trunkTop + trunkH * 0.1} Q${cx + canopyR * 0.9} ${trunkTop - canopyR * 0.1} ${cx + canopyR * 0.85} ${trunkTop - canopyR * 0.45}`}
            stroke={trunkColor} strokeWidth={trunkW * 0.38} fill="none" strokeLinecap="round"
          />
        </G>
      )}

      {/* Canopy — layered circles for depth */}
      {stage >= 1 && canopyR > 0 && (
        <G>
          {/* Back layer */}
          {stage >= 4 && (
            <>
              <Circle cx={cx - canopyR * 0.42} cy={trunkTop - canopyR * 0.1} r={canopyR * 0.68} fill={leafColor} opacity={0.35} />
              <Circle cx={cx + canopyR * 0.42} cy={trunkTop - canopyR * 0.1} r={canopyR * 0.68} fill={leafColor} opacity={0.35} />
            </>
          )}
          {/* Mid layer */}
          <Circle cx={cx} cy={trunkTop - canopyR * 0.15} r={canopyR} fill={leafColor} opacity={0.55} />
          {/* Front layer — slightly lighter */}
          <Circle cx={cx} cy={trunkTop - canopyR * 0.28} r={canopyR * 0.78} fill={leafColor} opacity={0.8} />
          {/* Highlight */}
          <Circle cx={cx - canopyR * 0.18} cy={trunkTop - canopyR * 0.5} r={canopyR * 0.32} fill={leafColor} opacity={0.4} />
        </G>
      )}

      {/* Milestone blossoms — appear at day 30, 60, 90 */}
      {stage >= 5 && (
        <G>
          <Circle cx={cx + canopyR * 0.3} cy={trunkTop - canopyR * 0.7} r={size * 0.022} fill="#FFD4A0" opacity={0.9} />
          <Circle cx={cx - canopyR * 0.35} cy={trunkTop - canopyR * 0.5} r={size * 0.018} fill="#FFD4A0" opacity={0.75} />
        </G>
      )}
      {stage >= 6 && (
        <G>
          <Circle cx={cx + canopyR * 0.55} cy={trunkTop - canopyR * 0.35} r={size * 0.02} fill="#FFD4A0" opacity={0.85} />
          <Circle cx={cx - canopyR * 0.6} cy={trunkTop - canopyR * 0.3} r={size * 0.024} fill="#FFD4A0" opacity={0.8} />
          <Circle cx={cx + canopyR * 0.1} cy={trunkTop - canopyR * 0.9} r={size * 0.016} fill={colors.gold} opacity={0.9} />
        </G>
      )}
      {stage >= 7 && (
        <G>
          {/* Ancient golden fruits */}
          {[-0.5, 0, 0.5, -0.3, 0.3].map((ox, i) => (
            <Circle
              key={i}
              cx={cx + ox * canopyR}
              cy={trunkTop - canopyR * (0.2 + (i % 3) * 0.25)}
              r={size * 0.022}
              fill={colors.gold}
              opacity={0.85}
            />
          ))}
        </G>
      )}

      {/* Wilt indicator — slight droop overlay when relapsed */}
      {isRelapsed && (
        <Path
          d={`M${cx} ${trunkTop - canopyR * 0.5} Q${cx + canopyR * 0.6} ${trunkTop} ${cx + canopyR * 0.7} ${trunkTop + canopyR * 0.2}`}
          stroke="#5A4A3A" strokeWidth={trunkW * 0.4} fill="none" strokeLinecap="round" opacity={0.5}
        />
      )}
    </Svg>
  );
}

export function LifeTree({ days, isRelapsed = false, size = 220 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity, width: size, height: size }]}>
      <TreeSvg days={days} isRelapsed={isRelapsed} size={size} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
