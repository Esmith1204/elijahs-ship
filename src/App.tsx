import { MotionConfig } from 'motion/react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@/components/layout/Layout';

// Each route is its own chunk.
const Home = lazy(() => import('@/pages/Home'));
const CaseStudy = lazy(() => import('@/pages/CaseStudy'));
const Styleguide = lazy(() => import('@/pages/styleguide/Styleguide'));
const WaveLab = lazy(() => import('@/pages/lab/WaveLab'));
const ShareImage = lazy(() => import('@/pages/lab/ShareImage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export function App() {
  return (
    // reducedMotion="user": people who prefer reduced motion get opacity-only fades.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            {/* Dev playground: full screen, no site chrome. */}
            <Route path="lab/wave" element={<WaveLab />} />
            <Route path="lab/share" element={<ShareImage />} />
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="work/:slug" element={<CaseStudy />} />
              <Route path="styleguide" element={<Styleguide />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  );
}
