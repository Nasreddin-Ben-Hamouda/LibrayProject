<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Loan;
use Doctrine\ORM\EntityManagerInterface;
use Hashids\Hashids;
use PhpParser\Node\Expr\Array_;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface;

class HomeController extends AbstractController
{

    private $manager;
    private $hashids;
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    public function __construct(EntityManagerInterface $manager,TokenStorageInterface $tokenStorage)
    {
        $this->manager=$manager;
        $this->hashids=new Hashids('',5);
        $this->tokenStorage = $tokenStorage;

    }
    /**
     * @Route("/", name="home",methods={"GET"})
     */
    public function showHome(Request $request)
    {
        $categories=[];
        $books=$this->getDoctrine()->getRepository(Book::class)->findAll();
        if ($request->query->getAlnum('s')) {
            $books=$this->getDoctrine()->getRepository(Book::class)->searchbytitle('%'.$request->query->getAlnum('s').'%');
        }
        foreach ($books as $book){
            if(!in_array($book->getCategory(), $categories)){
                array_push($categories,$book->getCategory());
            }
        }
        if($this->getUser()){
            if(sizeof($this->getUser()->getLoans())>0){
                $last15days  = new \DateTime();
                $last15days->setTimestamp(mktime(0, 0, 0, date("m"), date("d")-15,   date("Y")));
                if($this->getUser()->getLoans()[0]->getTakenAt() < $last15days){
                    $this->addFlash('warning',"you have exceeded 15 days without returning " . $this->getUser()->getLoans()[0]->getBook()->getTitle() );
                }
            }
        }

        return $this->render('home/home.html.twig',['books'=>$books,'categories'=>$categories]);
    }
    /**
     * @Route("/loanBook/{id}", name="loanBook")
     */
    public function loanBook($id)
    {
        if(sizeof($this->getUser()->getLoans())>0){
            $this->addFlash('warning', 'You can t loan two books at the same time');
            return $this->redirectToRoute('home');
        }

        $loan=new Loan();
        $loan->setBook($this->getDoctrine()->getRepository(Book::class)->find($id));
        $loan->setTakenAt(new \DateTime('now'));
        $loan->setUser($this->getUser());
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($loan);
        $entityManager->flush();
        $this->addFlash('success', 'Book successfully loan');
        return $this->redirectToRoute('home');
    }
    /**
     * @Route("/returnBook/{id}", name="returnbook")
     */
    public function returnBook($id)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entityManager->remove($this->getDoctrine()->getRepository(Loan::class)->find($id));
        $entityManager->flush();
        $this->addFlash('success', 'Book successfully returned');
        return $this->redirectToRoute('home');
    }
    /**
     * @Route("/contacts", name="contacts",methods={"GET"})
     */
    public function showContacts()
    {
        return $this->render('home/contacts.html.twig',[]);
    }
    /**
     * @Route("/about", name="about",methods={"GET"})
     */
    public function showAboutUs()
    {
        return $this->render('home/about.html.twig',[]);
    }
    /**
     * @Route("/profile", name="profile",methods={"GET"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function showProfile()
    {
        return $this->render('home/profile.html.twig',[]);
    }

}
